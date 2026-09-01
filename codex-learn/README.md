# Korean-learn

离线优先、响应式的韩语入门学习工具。学习记录仅保存在当前设备的浏览器中。

## 本地查看

使用任意静态服务器打开此目录，例如：

```powershell
node -e "require('http').createServer((q,s)=>require('fs').createReadStream(q.url==='/'?'index.html':'.'+q.url).pipe(s)).listen(4173)"
```

然后访问 `http://localhost:4173`。请勿直接双击打开 `index.html`，否则浏览器会阻止离线缓存功能。

## 发布到 GitHub Pages

1. 在 GitHub 新建一个公开仓库，例如 `korean-learn`。
2. 上传此目录的全部文件到仓库根目录，并推送到 `main` 分支。
3. 打开仓库的 **Settings → Pages**，在 **Build and deployment** 中选择 **Deploy from a branch**，并选择 `main` 与 `/(root)`。
4. 等待发布完成后，GitHub 会显示站点网址。首次用 Edge、夸克或 Via 打开后，可在浏览器菜单中选择“安装应用”或“添加到主屏幕”。

GitHub Pages 在中国大陆的连通性无法保证；第一版已按这一限制设计，课程本身安装后可离线使用。
