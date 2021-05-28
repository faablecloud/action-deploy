# Deploy on FaableCloud

Deploy your `node` based repo into FaableCloud.

Create file in `.github/workflows/deploy.yml` with the following contents.

- If the name of your primary branch is not `main`, remember to change it.

```yml
name: FaableCloud Deploy
on:
  push:
    branches: [main]
jobs:
  deploy-to-faable:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: faablecloud/action-deploy@main
        with:
          faable_app_name: "example-app"
          faable_api_key: ${{ secrets.FAABLE_API_KEY }}
          faable_user: "faablecloud"
          enable_debug: true
```
