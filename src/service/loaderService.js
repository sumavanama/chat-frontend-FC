function LoaderService() {
    loaderElement = null;
  function createLoaderElement(e) {
        loaderElement = e;
        hide();
    }
   function show() {
        loaderElement.style.display = "flex";
    }
   function hide() {
        loaderElement.style.display = "none";
    }
}
export const loaderService = new LoaderService();