# GRAMO SHE Consultants — Website

One-page website for GRAMO SHE Consultants: railway safety, health, safety and environmental management across South Africa and the SADC region.

Plain HTML, CSS and JavaScript with no build step. Upload the folder to any web host, or open `index.html` in a browser.

## Structure
- `index.html`: page content
- `assets/css/styles.css`: brand styles (navy, gold, slate; Poppins)
- `assets/js/main.js`: menu, scroll effects and the quote form
- `assets/img/`: logo and photos from the company profile

## Quote form
Enquiries are sent to granny@gramo.co.za through [FormSubmit](https://formsubmit.co). The first submission from the live site triggers a one-time activation email. Click the link in it to switch the form on. If sending fails, the form opens the visitor's email app instead. To change the endpoint, edit `FORM_ENDPOINT` at the top of the form section in `assets/js/main.js`.
