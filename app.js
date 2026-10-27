/* =========================================
   MAINTENANCE PAGE — JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    // تحديث السنة تلقائياً
    const currentYear = document.getElementById("currentYear");

    if (currentYear) {
        currentYear.textContent = new Date().getFullYear();
    }

    // إدارة الشعار
    const logoContainer = document.querySelector(".logo-container");
    const logoPlaceholder = document.getElementById("logoPlaceholder");
    const logoImage = document.querySelector(".site-logo");

    if (logoContainer && logoImage && logoPlaceholder) {

        function updateLogo() {

            if (logoImage.complete && logoImage.naturalWidth > 0) {
                logoImage.style.display = "block";
                logoPlaceholder.style.display = "none";
            } else {
                logoImage.style.display = "none";
                logoPlaceholder.style.display = "flex";
            }

        }

        logoImage.addEventListener("load", updateLogo);
        logoImage.addEventListener("error", updateLogo);

        updateLogo();
    }

    // إضافة حركة دخول سلسة للبطاقة
    const maintenanceCard = document.querySelector(".maintenance-card");

    if (maintenanceCard) {
        maintenanceCard.setAttribute("data-loaded", "true");
    }

});
