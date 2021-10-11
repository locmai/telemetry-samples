from locust import FastHttpUser, task, between

class SimpleUser(FastHttpUser):
    wait_time = between(1, 3)

    @task(2)
    def get_index_page(self):
        self.client.get("/")

    @task
    def get_random_page(self):
        self.client.get("/random")