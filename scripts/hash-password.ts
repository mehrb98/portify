// Usage: npm run hash-password -- "your password"
import { hashPassword } from "../src/lib/password";

const pw = process.argv[2];
if (!pw || pw.length < 10) {
  console.error('Pass a password of at least 10 characters: npm run hash-password -- "..."');
  process.exit(1);
}
hashPassword(pw).then((h) => console.log(`ADMIN_PASSWORD_HASH="${h}"`));
