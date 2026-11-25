import { expect, test } from "@playwright/test";

for (const savedBasket of [false, true]) {
  test(`hydrates on load and reload with ${savedBasket ? "a saved" : "an empty"} basket`, async ({
    page,
  }) => {
    const hydrationErrors: string[] = [];
    page.on("pageerror", (error) => hydrationErrors.push(error.message));
    page.on("console", (message) => {
      if (
        message.type() === "error" &&
        /hydrat|server rendered|didn't match/i.test(message.text())
      ) {
        hydrationErrors.push(message.text());
      }
    });
    if (savedBasket) {
      await page.addInitScript(() =>
        localStorage.setItem(
          "nook-and-cake-cart-v2",
          JSON.stringify({
            state: {
              items: [
                {
                  cartItemId: "saved-bento",
                  productId: "prod-bento-classic",
                  name: "Saved bento",
                  variant: "BENTO",
                  unitPrice: 52000,
                  quantity: 1,
                  selectedAddons: [],
                },
              ],
            },
            version: 0,
          }),
        ),
      );
    }
    for (let load = 0; load < 2; load++) {
      if (load === 0) await page.goto("/", { waitUntil: "networkidle" });
      else await page.reload({ waitUntil: "networkidle" });
      await expect(page.locator(".product-card")).toHaveCount(5);
      await expect(
        page.getByRole("group", { name: "Tampilan cheesecake" }),
      ).toBeVisible();
      await page
        .getByRole("button", { name: "Keranjang", exact: true })
        .click();
      await expect(page.getByRole("dialog")).toBeVisible();
      await expect(page.getByRole("dialog")).toContainText(
        savedBasket ? "Saved bento" : "Masih ada ruang",
      );
      await page.keyboard.press("Escape");
    }
    expect(hydrationErrors).toEqual([]);
  });
}
