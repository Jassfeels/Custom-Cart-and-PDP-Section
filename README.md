# Custom Shopify Theme Features – Task 1 & 2

This repository contains a customized Shopify theme implementing:

* Task 1: Custom Cart Drawer with Tiered Discount System
* Task 2: Modular Product Detail Page (PDP) Sections based on Metafields and Tags

---

## 🚀 Quick Start

### 1. Upload Theme Files

Place the following files into your Shopify theme (via code editor or GitHub integration):

#### Required Theme Files:

```
layout/
  └── theme.liquid

sections/
  ├── usp-section.liquid
  ├── scientific-breakdown.liquid
  └── video-modal.liquid

snippets/
  └── video-modal-structure.liquid

assets/
  ├── custom-cart.js
  └── video-modal.css

customers/
  └── account.liquid (optional integration for dynamic features)
```

### 2. Custom Cart Drawer (Task 1)

* Uses Shopify AJAX API with jQuery
* Automatically calculates:

  * 5% discount at \$100
  * 10% discount at \$200
  * 15% discount at \$300
* Includes visual tier progress bar
* Real-time quantity updates and item removal

#### Integration:

* Include `custom-cart.js` and add markup to your theme (`theme.liquid` or cart trigger location):

```html
<script src="{{ 'custom-cart.js' | asset_url }}" defer></script>
```

* Add a button to trigger:

```html
<a href="#" onclick="openCartDrawer(); return false;">Open Cart</a>
```

### 3. Modular PDP Sections (Task 2)

Renders different sections dynamically based on product metafields and tags.

#### Conditions:

* If `product.metafields.custom.usp_1` exists → load **USP Section**
* If product has tag `clinical-grade` → load **Scientific Breakdown**
* If `product.metafields.custom.video_demo_url` exists → load **Video Modal**

#### Add this loader to `main-product.liquid` or a product template:

```html
<div id="usp-container"></div>
<div id="science-container"></div>
<div id="video-container"></div>

<script>
const handle = '{{ product.handle }}';
$('#usp-container').load('/sections/usp-section?product_handle=' + handle);
$('#science-container').load('/sections/scientific-breakdown?product_handle=' + handle);
$('#video-container').load('/sections/video-modal?product_handle=' + handle);
</script>
```

#### Add this to `theme.liquid` before </body>:

```liquid
{% render 'video-modal-structure' %}
<link rel="stylesheet" href="{{ 'video-modal.css' | asset_url }}">
```

---

## 📊 Architecture Highlights

* Theme uses Online Store 2.0-compatible modular structure
* All section rendering is lazy-loaded via jQuery `.load()`
* Cart uses Shopify's `/cart.js` and `/cart/change.js` endpoints
* Discount progress bar is milestone-based, visually mapped (0–100%)
* Video modal detects `.mp4`, YouTube and Vimeo links, and opens in modal overlay

---

## 🔧 Assumptions

* Customer is logged in during cart updates (if needed for personalization)
* jQuery is loaded in theme (you can add via CDN if not included)
* Theme supports dynamic Liquid rendering (e.g. Dawn base theme)

---

## 📅 Optional Enhancements

* Convert progress bar to React or Alpine.js component
* Add localStorage backup if cart API fails
* Automatically format video URLs using regex
* Enhance mobile modal experience

---

 #Sanjay Singh
