// Augments Vue Router's `RouteMeta` so custom route meta fields are typed.
// Without this, `to.meta.title` resolves to `{}`, which trips the
// `no-base-to-string` and `restrict-template-expressions` lint rules.
import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    inMenu?: boolean;
    typeOfMenu?: string[] | null;
    layout?: string;
  }
}
