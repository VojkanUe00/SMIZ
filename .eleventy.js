const fs = require("fs");
const path = require("path");

module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({ "css": "css" });
  eleventyConfig.addPassthroughCopy({ "js": "js" });
  eleventyConfig.addPassthroughCopy({ "images": "images" });
  eleventyConfig.addPassthroughCopy({ "assets": "assets" });

  const cleanRouteMap = {
    "/index.html#home": "/",
    "/index.html#proizvodi": "/proizvodi/",
    "/about.html": "/o-nama/",
    "/contact.html": "/kontakt/",
    "/automatska-vrata.html": "/proizvodi/automatska-vrata/",
    "/bolnicka-vrata.html": "/proizvodi/bolnicka-vrata/",
    "/unutrasnja-vrata.html": "/proizvodi/unutrasnja-vrata/",
    "/industrijska-vrata.html": "/proizvodi/industrijska-vrata/",
    "/garazna-vrata.html": "/proizvodi/garazna-vrata/",
    "/zastita-od-radijacije.html": "/proizvodi/zastita-od-radijacije/",
    "/primax.html": "/proizvodi/primax/",
    "/pages/about.html": "/o-nama/",
    "/pages/contact.html": "/kontakt/",
    "/pages/automatska-vrata.html": "/proizvodi/automatska-vrata/",
    "/pages/bolnicka-vrata.html": "/proizvodi/bolnicka-vrata/",
    "/pages/unutrasnja-vrata.html": "/proizvodi/unutrasnja-vrata/",
    "/pages/industrijska-vrata.html": "/proizvodi/industrijska-vrata/",
    "/pages/garazna-vrata.html": "/proizvodi/garazna-vrata/",
    "/pages/zastita-od-radijacije.html": "/proizvodi/zastita-od-radijacije/",
    "/pages/primax.html": "/proizvodi/primax/"
  };

  const relativeRouteMap = {
    "about\\.html": "/o-nama/",
    "contact\\.html": "/kontakt/",
    "automatska-vrata\\.html": "/proizvodi/automatska-vrata/",
    "bolnicka-vrata\\.html": "/proizvodi/bolnicka-vrata/",
    "unutrasnja-vrata\\.html": "/proizvodi/unutrasnja-vrata/",
    "industrijska-vrata\\.html": "/proizvodi/industrijska-vrata/",
    "garazna-vrata\\.html": "/proizvodi/garazna-vrata/",
    "zastita-od-radijacije\\.html": "/proizvodi/zastita-od-radijacije/",
    "primax\\.html": "/proizvodi/primax/"
  };

  eleventyConfig.addShortcode("extractMain", (relativeFilePath) => {
    const fullPath = path.join(process.cwd(), relativeFilePath);
    const raw = fs.readFileSync(fullPath, "utf8");

    let content = "";
    if (relativeFilePath === "index.html") {
      const match = raw.match(/<\/header>([\s\S]*?)<footer\s+class="footer">/i);
      content = match ? match[1] : "";
    } else {
      const match = raw.match(/<main[^>]*>[\s\S]*?<\/main>/i);
      content = match ? match[0] : "";
    }

    let normalizedContent = content
      .replace(/href="\.\.\//g, 'href="/')
      .replace(/src="\.\.\//g, 'src="/')
      .replace(/href='\.\.\//g, "href='/")
      .replace(/src='\.\.\//g, "src='/")
      .replace(/href="pages\//g, 'href="/pages/');

    Object.entries(cleanRouteMap).forEach(([legacyHref, cleanHref]) => {
      normalizedContent = normalizedContent
        .split(`href=\"${legacyHref}\"`).join(`href=\"${cleanHref}\"`)
        .split(`href='${legacyHref}'`).join(`href='${cleanHref}'`);
    });

    normalizedContent = normalizedContent
      .replace(/href=\"#home\"/g, 'href="/"')
      .replace(/href=\"#proizvodi\"/g, 'href="/proizvodi/"')
      .replace(/href='#home'/g, "href='/'")
      .replace(/href='#proizvodi'/g, "href='/proizvodi/'");

    normalizedContent = normalizedContent
      .replace(/href=(["'])(?:\.\.\/)?index\.html#home\1/g, 'href=$1/$1')
      .replace(/href=(["'])(?:\.\.\/)?index\.html#proizvodi\1/g, 'href=$1/proizvodi/$1');

    Object.entries(relativeRouteMap).forEach(([legacyHrefPattern, cleanHref]) => {
      const relativeRegex = new RegExp(
        `href=(["'])(?:\\.\\.\\/)?(?:pages\\/)?${legacyHrefPattern}\\1`,
        "g"
      );
      normalizedContent = normalizedContent.replace(relativeRegex, `href=$1${cleanHref}$1`);
    });

    return normalizedContent;
  });

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "dist"
    },
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};