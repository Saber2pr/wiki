import { join } from "path"
import { WriteFile } from "./node"
import { createMenu } from "./createMenu"

const config_path_blog = join(process.cwd(), "config/blog")

const paths = {
  blog: join(process.cwd(), "/blog")
}

const createBlogConfig = async (root: string) =>
  await createMenu(root).then(text => {
    const lines = text.split("\n")
    lines.shift()
    return lines.map(l => l.slice(2)).join("\n")
  })

async function main() {
  // create blog menu
  const menu = await createBlogConfig(paths.blog)
  await WriteFile(config_path_blog, menu)
}

main().catch(console.log)
