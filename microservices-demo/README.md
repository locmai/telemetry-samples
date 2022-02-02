Inspired by the [microservices-demo](https://github.com/GoogleCloudPlatform/microservices-demo) from Google.

Extended with OpenTelemetry usage and non-GKE deployments.

## Quickstart

Build the images:

```
skaffold build
```

Deploy:

```
skaffold deploy
```

## Notes

Set the default repo:

```
skaffold config set default-repo <myrepo>
```

## TODOs

I commented out these lines causing the `frontend` service to stop responding to requests

```
// "deploymentDetails": getDeploymentDetails(r),
```

The fix is being reviewed https://github.com/GoogleCloudPlatform/microservices-demo/pull/699
