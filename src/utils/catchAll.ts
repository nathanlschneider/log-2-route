import { logger } from "../index";
export default function catchAll() {
  window.addEventListener("error", function (e) {
    logger.error(e);
  });
}
