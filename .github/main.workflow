workflow "Publish master to gh-pages" {
  on = "push"
  resolves = ["Publish to gh-pages branch"]
}

action "Filter branch" {
  uses = "actions/bin/filter@master"
  args = "branch master"
}

action "Publish to gh-pages branch" {
  uses = "pinkkis/page-publisher-gh-action@master"
  env = {
    TARGET_REPO = "pinkkis/phaser-driving"
  }
  secrets = [
    "GITHUB_TOKEN",
  ]
  args = "gh-pages"
  needs = ["Filter branch"]
}
