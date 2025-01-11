# CSP

```javascript
 @Get('/')
  async getNonce(
    @Req() req: Request,
    // если res, то отправка через res.send(), иначе не возвращает значение
    @Res() res: Response,
    next: () => void,
  ): Promise<void> {
    console.log('i');

    if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
      next();
    } else {
      crypto.webcrypto.getRandomValues(nonceBuffer);
      const nonce = nonceBuffer.toString('base64');

      res.header(
        'Cache-Control',
        'private, no-cache, no-store, must-revalidate',
      );
      // Add CSP policy to the HTML request header to enfornce the nonce in the script and style tags
      res.header(
        'Content-Security-Policy',
        `object-src 'none'; base-uri 'none'; media-src 'none';frame-src 'self';connect-src 'self';img-src 'self'; script-src 'strict-dynamic' 'nonce-${nonce}' 'unsafe-inline' 'self'; require-trusted-types-for 'script'; style-src 'self' 'nonce-${nonce}'; `,
      );

      res.header('Expires', '-1');
      res.header('Pragma', 'no-cache');
      const data = fs.readFileSync(
        path.join(__dirname, '/build', 'index.html'),
        {
          encoding: 'utf8',
        },
      );

      // replace all _NONCE_ placeholder with the generated nonce
      const result = data.replaceAll('_NONCE_', nonce);
      res.send(result);
    }
  }
```
