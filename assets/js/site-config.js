/* ==========================================================================
   Konfiguracja strony — jedyne miejsce, które trzeba edytować, żeby uruchomić formularz.

   formEndpoint: adres, na który formularz wyśle dane metodą POST (FormData),
                 oczekując odpowiedzi 2xx. Pasuje np. do Formspree, Getform,
                 Web3Forms albo własnego skryptu PHP na hostingu.
                 Dopóki pole jest puste, formularz działa w trybie podglądu
                 i niczego nie wysyła.
   ========================================================================== */
window.SITE_CONFIG = {
  formEndpoint: "",
};
