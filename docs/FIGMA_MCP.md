# Figma MCP Integration

## Configuration

Your Figma access token has been configured in `.env.figma`.

### Environment Variable
```
FIGMA_ACCESS_TOKEN=your_figma_token_here
```

**Note:** The actual token is stored in `.env.figma` (not tracked in git). Replace `your_figma_token_here` with your actual token from Figma account settings.

### Usage

To use the Figma MCP in your project:

1. **Load the environment variable** in your application:
   ```javascript
   // In your Node.js app
   require('dotenv').config({ path: '.env.figma' });
   const figmaToken = process.env.FIGMA_ACCESS_TOKEN;
   ```

2. **Install Figma API client** (if needed):
   ```bash
   npm install figma-api
   ```

3. **Basic usage example**:
   ```javascript
   const Figma = require('figma-api');
   const api = new Figma.Api({
     personalAccessToken: process.env.FIGMA_ACCESS_TOKEN
   });
   
   // Fetch a file
   const file = await api.getFile('YOUR_FILE_KEY');
   ```

### Security Notes
- ⚠️ Never commit `.env.figma` to version control (already added to `.gitignore`)
- 🔒 Keep your Figma token secure
- 🔄 Rotate tokens periodically for security

### Resources
- [Figma API Documentation](https://www.figma.com/developers/api)
- [Figma API npm package](https://www.npmjs.com/package/figma-api)
