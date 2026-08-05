import time
from playwright.sync_api import sync_playwright

def verify_3d_design():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        # Set a premium larger viewport size
        page = browser.new_page(viewport={"width": 1440, "height": 900})

        # Go to local Vite server
        page.goto("http://localhost:3003/")
        page.wait_for_load_state("networkidle")
        time.sleep(2)  # Let animations initialize

        # Take an initial screenshot of the Hero and calculator widget
        page.screenshot(path="/home/jules/verification/hero_3d.png")
        print("Hero screenshot saved.")

        # Scroll down slightly to make the floating 3D elements and Bento grid visible
        page.evaluate("window.scrollTo(0, 1100)")
        time.sleep(2)

        # Hover over one of the Bento cards or trusted partners to activate the 3D tilt and shine glare
        # We find a Bento feature card. Let's hover over "Global Network, Local Expertise" card.
        # Let's locate the card and hover.
        try:
            card = page.get_by_text("Global Network, Local Expertise")
            card.hover()
            time.sleep(1)
            print("Hovered over Bento card successfully.")
        except Exception as e:
            print("Failed to hover Bento card:", e)

        # Take a second screenshot showcasing the parallax scrolled grid
        page.screenshot(path="/home/jules/verification/scrolled_parallax.png")
        print("Scrolled parallax screenshot saved.")

        browser.close()

if __name__ == "__main__":
    verify_3d_design()
