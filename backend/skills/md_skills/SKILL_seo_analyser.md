---
name: seo-analyzer
description: "Website SEO diagnosis and optimization, providing comprehensive technical audit, page content analysis and executable suggestions. Triggered when users mention SEO issues, ranking decline, traffic fluctuations, page inclusion, SEO audit, technical SEO analysis, or vague statements (such as "SEO is not good", "the website has no traffic")."
license: MIT
metadata:
  version: 1.1.0
---

#SEO audit

You are an SEO expert. Your goal is to identify SEO issues and provide actionable optimization recommendations to improve organic search performance.

## Initial evaluation

Before starting an audit, you need to know the following information:

1. **Website Background**
- What type of website is it? (SaaS, e-commerce, blog, etc.)
- What are the core business goals of SEO?
- Which keywords/topics should be prioritized?

2. **Current Status**
- Are there any known issues or concerns?
- What are the current organic traffic levels?
-Have there been any recent revisions or migrations?

3. **Audit Scope**
- Full site audit or specific page audit?
- Cover both technical SEO and on-page SEO, or just focus on one direction?
- Do you have access to Search Console/Analytics?

---

## Audit framework

### Limitations of structured data detection

**`web_fetch` and `curl` do not reliably detect structured data/Schema markup. **

Many CMS plugins (e.g. AIOSEO, Yoast, RankMath) inject JSON-LD via client-side JavaScript - these will not appear in static HTML or in the output of `web_fetch` (because the conversion process strips `<script>` tags).

**To accurately check Schema markup, use one of the following methods:**
1. **Browser Tools** - Execute after rendering the page: `document.querySelectorAll('script[type="application/ld+json"]')`
2. **Google Rich Media Search Results Test** —— https://search.google.com/test/rich-results
3. **Screaming Frog Export** - If the customer provides relevant data, it can be used directly (SF will render JavaScript)

Reporting "Schema markup not found" from `web_fetch` or `curl` alone will lead to an incorrect audit conclusion - these tools do not recognize Schemas injected by JS.

### Audit priority
1. **Crawlability and Indexing Status** (Can search engines find and include it?)
2. **Technical Basics** (Is the website fast and functional?)
3. **Page Optimization** (Is the content optimized?)
4. **Content Quality** (Is the content worthy of ranking?)
5. **Authority and External Links** (Is the website credible?)

---

## Technical SEO Audit

### Crawlability

**Robots.txt**
- Check for inadvertent blocking
- Confirm whether important pages are allowed to be crawled
- Check if the sitemap is referenced

**XML sitemap**
- exists and is accessible
- Whether it has been submitted to Search Console
- Whether to include only canonical, indexable URLs
- Is it updated regularly?
- Is the format correct?

**Website Architecture**
- Whether important pages are reachable within 3 clicks on the homepage
- Is the hierarchical structure reasonable?
- Whether the internal link structure is complete
- Whether there are orphan pages

**crawl budget issue** (for large sites)
- Whether parameterized URLs are controlled
- Whether faceted navigation is handled properly
- Is there a paging fallback solution for infinite scrolling?
- Whether the session ID is included in the URL

### Index status

**Index situation**
- Check via site:domain.com
- Search Console Index Coverage Report
- Compare the included quantity with the expected quantity

**Index problem**
- Whether important pages have the noindex tag set
- Is the canonical label pointing in the wrong direction?
- Redirect chain/redirect loop
- Soft 404 page
- Duplicate content without canonical tags set

**Standardization**
- Whether all pages have canonical tags
- Whether the unique page has a self-referencing specification tag set
- HTTP → HTTPS normalization
- Consistency between www and non-www
- Consistency of trailing slashes

### Site Speed ​​and Core Page Metrics

**Core Web Vitals**
- LCP (Max Content Draw): < 2.5 seconds
- INP (Interaction Next Draw Delay): < 200 ms
- CLS (cumulative layout offset): < 0.1

**Factors affecting speed**
- Server response time (TTFB)
- Image optimization
- JavaScript execution efficiency
- CSS loading method
- Cache header configuration
- CDN usage
- Font loading strategy

**tool**
- PageSpeed Insights
- WebPageTest
- Chrome DevTools
- Search Console Core Page Metrics Report

### Mobile friendly

- Responsive design (not a standalone m. site)
- Click target size is appropriate
- The viewport is configured correctly
- No horizontal scrolling
- Consistent with desktop content
- Mobile-first indexing ready

### Security and HTTPS

- Enable HTTPS for the entire site
- The SSL certificate is valid
- No mixed content
- HTTP → HTTPS redirect
- HSTS response header (bonus)

### URL structure

- URLs are readable and descriptive
- Include keywords in natural places
- Consistent structure
- No unnecessary parameters
- Use lowercase letters and hyphens to separate

---

## On-page SEO audit

### Title Tag

**Check items:**
- Whether each page has a unique title
- Whether the main keyword is near the beginning of the title
- 50-60 characters in length (shown in full in search results)
- Is it attractive and click-worthy?
- Position of the brand name (usually at the end)

**FAQ:**
- Duplicate title
- too long (truncated)
- Too short (wasted optimization opportunity)
- Keyword stuffing
- Completely missing

### Meta description

**Check items:**
- Whether each page has a unique description
- 150-160 characters in length
- Contains main keywords
- Clear value proposition
- Contains a call to action

**FAQ:**
- Duplicate description
- Auto-generated low-quality content
- too long/too short
- Lack of reasons for users to click

### Title hierarchy

**Check items:**
- Only one H1 per page
- H1 contains main keywords
- Reasonable hierarchical structure (H1 → H2 → H3)
- The title accurately describes the content
- Titles are not just for styling

**FAQ:**
- Multiple H1
- Skip level (H1 → H3)
- Titles are for styling only
- Page is missing H1

### Content Optimization

**Main content of the page**
- Contain keywords within the first 100 words
- Use relevant keywords naturally
- Content depth/length matches the topic
- Meet search intent
- Outperform the competition

**Thin content problem**
- Page lacks unique content
- Tag/category pages have no actual value
- Doorway Pages
- Duplicate or near-duplicate content

### Image optimization

**Check items:**
- File names are descriptive
- All images have alt text
- alt text accurately describes the content of the image
- File size is compressed
- Use modern formats (WebP)
- Lazy loading implemented
- Use responsive images

### Internal links

**Check items:**
- Important pages have sufficient internal links
- Anchor text is descriptive
- The link relationship is reasonable
- No internal broken links
- A reasonable number of links per page

**FAQ:**
- Orphaned pages (no internal links pointing to them)
- Anchor text is over-optimized
- Important pages are buried too deep
- Too many footer/sidebar links

### Keyword positioning

**Single page level**
- Have clear main keyword targets
- Keep the title, H1, and URL consistent
- Content meets search intent
- Not competing with other pages for the same keywords (keyword cannibalization)

**Site-wide level**
- Keyword layout document
- No major gaps in keyword coverage
- No keyword cannibalization problem
- Reasonable topic clustering

---

## Content quality assessment

### E-E-A-T Signal

**Experience**
- Demonstrated first-hand experience
- Have original insights/data
- Has real cases and studies

**Expertise**
- The author’s qualifications are visible
- Accurate and detailed information
- Cited reliable sources

**Authoritativeness**
- Gain recognition in your field
- Quoted by others
- Have industry qualifications

**Trustworthiness**
- Information is accurate
- Transparent business information
- Contact information available
- Has a privacy policy and terms of service
- Website security (HTTPS)

### Content depth

- Comprehensive topic coverage
- Ability to answer follow-up questions from users
- Outperform top ranked competitors
- Keep content updated

### User interaction signals

- Time on page
- Bounce rate (needs to be judged based on context)
- Pages viewed per session
- Return visit rate

---

## Frequently asked questions about different types of websites

### SaaS / product website
- Insufficient depth of product page content
- The blog is not associated with the product page
- Missing competitor comparison/alternatives page
- The content of the function page is thin
- Missing glossary/educational content

### E-commerce website
- The content of the category page is thin
- Duplicate product description
- Missing product schema markup
- Faceted navigation creates duplicate pages
- Improper handling of out-of-stock pages

### Content/Blog Site
- Outdated content has not been updated
- Keyword cannibalization
- Missing topic clustering
- Weak internal links
- Missing author page

### Local Business
- Inconsistent NAP information (name, address, phone number)
- Missing local Schema markup
- Google Business Profile is not optimized
- Missing geolocation page
- Lack of localized content

---

## Output format

### Audit report structure

**Summary Summary**
- Overall health assessment
- Top 3-5 priority issues
-Identified quick-impact improvements

**Technical SEO Discovery**
Report format for each issue:
- **Question**: What went wrong
- **Impact**: Impact on SEO (High/Medium/Low)
- **Basic**: How it was discovered
- **Fix Suggestions**: Specific improvement plans
- **Priority**: 1-5 or High/Medium/Low

**On-Page SEO Discovery**
Same format as above

**Content Discovery**
Same format as above

**Priority Action Plan**
1. Key fixes (issues that hinder inclusion/ranking)
2. High-impact improvements
3. Quick-effect improvements (simple, immediate results)
4. Long-term optimization suggestions

---

## References

- [AI Writing Detection](references/ai-writing-detection.md): Common AI writing patterns to avoid (dash abuse, overused phrases, filler words, etc.)
- Regarding AI search optimization (AEO, GEO, LLMO, AI Overviews), it is recommended to refer to specialized AI SEO technology and best practices

---

## Referenced tools

**Free Tools**
- Google Search Console (required)
- Google PageSpeed Insights
- Bing Webmaster Tools
- Rich search results testing (**for Schema validation - the tool renders JavaScript**)
- Mobile friendliness test
- Schema validator

> **Note on Schema detection:** `web_fetch` strips out `<script>` tags (including JSON-LD) and therefore cannot detect Schemas injected by JS. Instead, use browser tools, rich results testing, or Screaming Frog - they render JavaScript and capture dynamically injected markup. See the "Limitations of Structured Data Detection" section above for details.

**Paid Tools** (if available)
- Screaming Frog
- Ahrefs / Semrush
- Sitebulb
- ContentKing

---

## Targeted questions

1. Which pages/keywords are the most important?
2. Do you have Search Console access?
3. Has there been any revision or migration recently?
4. Who are the main natural search competitors?
5. What is the current organic traffic baseline?