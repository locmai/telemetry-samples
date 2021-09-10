package com.maibaloc.telemetry_sample_java;

import io.prometheus.client.Counter;
import io.prometheus.client.Summary;
import io.prometheus.client.Summary.Child;
import io.prometheus.client.exporter.MetricsServlet;
import io.prometheus.client.hotspot.DefaultExports;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.eclipse.jetty.server.Server;
import org.eclipse.jetty.servlet.ServletContextHandler;
import org.eclipse.jetty.servlet.ServletHolder;
import java.io.IOException;
import java.lang.Math;

public class App {

    static class IndexServlet extends HttpServlet {
        static final Summary s = Summary.build().name("request_processing_seconds").labelNames("path")
                .help("Total requests received").register();
        static final Counter c = Counter.build().name("my_requests").help("Total requests received").labelNames("path", "method", "status").register();
                
        @Override
        protected void doGet(final HttpServletRequest req, final HttpServletResponse resp)
                throws ServletException, IOException {

            s.startTimer();

            try {
                resp.getWriter().println("OK - path /");
                // Increment the number of requests.
                c.labels("/", "GET", "200").inc();
            }
            finally {
            }
        }
    }

    static class RandomServlet extends HttpServlet {
        @Override
        protected void doGet(final HttpServletRequest req, final HttpServletResponse resp)
                throws ServletException, IOException {
            // MetricWriter.s.labels("/random");
            // Summary.Timer timer = MetricWriter.s.startTimer();

            try {
                double r = Math.random();
                if (r < 0.5) {
                    // MetricWriter.c.labels("/random", "GET", "503").inc();
                    resp.sendError(HttpServletResponse.SC_SERVICE_UNAVAILABLE);
                }
                resp.getWriter().println("OK - path /random");
                // MetricWriter.c.labels("/random", "GET", "200").inc();
            }
            finally {
                // timer.observeDuration();
            }
        }
    }

    public static void main(String[] args) throws Exception {
        Server server = new Server(8080);
        ServletContextHandler context = new ServletContextHandler();
        context.setContextPath("/");
        server.setHandler(context);

        // Expose our example servlet.
        context.addServlet(new ServletHolder(new IndexServlet()), "/");
        context.addServlet(new ServletHolder(new RandomServlet()), "/random");
        
        // Expose Promtheus metrics.
        context.addServlet(new ServletHolder(new MetricsServlet()), "/metrics");
        // Add metrics about CPU, JVM memory etc.
        DefaultExports.initialize();

        // Start the webserver.
        server.start();
        server.join();
    }
}