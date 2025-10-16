# Docker Hub Setup for GitHub Actions

This guide explains how to configure GitHub Actions to automatically push Docker images to Docker Hub.

## Prerequisites

1. A Docker Hub account
2. Admin access to your GitHub repository

## Setup Steps

### 1. Create Docker Hub Access Token

1. Log in to [Docker Hub](https://hub.docker.com/)
2. Click on your username in the top right → **Account Settings**
3. Navigate to **Security** → **Access Tokens**
4. Click **New Access Token**
5. Configure the token:
   - **Description**: `GitHub Actions - Hollow Gear 5E`
   - **Access permissions**: `Read, Write, Delete`
6. Click **Generate**
7. **Important**: Copy the token immediately - you won't be able to see it again!

### 2. Add Secrets to GitHub Repository

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add the following two secrets:

#### Secret 1: DOCKERHUB_USERNAME
- **Name**: `DOCKERHUB_USERNAME`
- **Value**: Your Docker Hub username (e.g., `rickfast`)

#### Secret 2: DOCKERHUB_TOKEN
- **Name**: `DOCKERHUB_TOKEN`
- **Value**: The access token you created in step 1

### 3. Verify Configuration

The workflow is now configured to:

1. **On Pull Requests**: Build and test the Docker image (no push)
2. **On Push to Main**: Build, test, AND push to Docker Hub with tags:
   - `rickfast/hollow-gear-5e:latest`
   - `rickfast/hollow-gear-5e:main-<commit-sha>`

## Testing the Workflow

### Test Locally

Before pushing, you can test the Docker build locally:

```bash
docker build -t rickfast/hollow-gear-5e:test .
docker run -d -p 8080:80 rickfast/hollow-gear-5e:test
curl http://localhost:8080/
```

### Test on GitHub

1. Create a new branch
2. Make a small change
3. Create a pull request
4. The workflow will run and build the image (but not push)
5. Merge to main
6. The workflow will build, test, and push to Docker Hub

## Workflow Details

### Build Job
- Runs on all pushes and pull requests
- Builds the Docker image
- Starts a test container
- Tests health endpoint and main page
- Stops the container

### Push Job
- Only runs on pushes to main branch
- Requires build job to succeed
- Logs in to Docker Hub using secrets
- Builds multi-platform images (amd64 and arm64)
- Pushes to Docker Hub with appropriate tags
- Uses GitHub Actions cache for faster builds

## Pulling the Image

Once pushed, anyone can pull and run your image:

```bash
# Pull latest version
docker pull rickfast/hollow-gear-5e:latest

# Run the container
docker run -d -p 8080:80 rickfast/hollow-gear-5e:latest

# Access the application
open http://localhost:8080
```

## Troubleshooting

### Authentication Failed
- Verify `DOCKERHUB_USERNAME` is correct (case-sensitive)
- Regenerate the access token if needed
- Ensure the token has `Read, Write, Delete` permissions

### Build Failed
- Check the GitHub Actions logs
- Test the build locally first
- Verify all dependencies are available

### Push Failed
- Ensure the repository exists on Docker Hub
- Check that the token hasn't expired
- Verify network connectivity in GitHub Actions

## Security Best Practices

✅ **DO**:
- Use access tokens instead of passwords
- Limit token permissions to what's needed
- Rotate tokens periodically
- Use repository secrets (never commit tokens)

❌ **DON'T**:
- Share your access token
- Commit tokens to the repository
- Use your Docker Hub password in workflows
- Give tokens more permissions than needed

## Additional Resources

- [Docker Hub Access Tokens](https://docs.docker.com/docker-hub/access-tokens/)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)
- [Docker Build Push Action](https://github.com/docker/build-push-action)
