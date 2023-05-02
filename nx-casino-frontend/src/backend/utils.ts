export type Headers = {
  [key: string]: string | string[] | undefined;
};
// aws lambda event provides headers as uppercase
// koa provides headers as lowercase
// lowercases object keys and keeps original values
export const normalizeHeaders = (headers: Headers): Headers => {
  return Object.entries(headers).reduce((acc, [key, value]) => {
    return {
      [key.toLowerCase()]: value,
      ...acc,
    };
  }, {}) as Headers;
};

// caches returned result by function
// does not check if arguments have changed
export const noArgsMemoize = <Func extends (...args: any[]) => any>(
  fn: Func
) => {
  let result: any = undefined;
  let called = false;

  return (...args: Parameters<Func>): ReturnType<Func> => {
    if (called) {
      return result;
    }

    // calls function before setting the flag
    // so errors not ignored next time function is called
    result = fn(...args);
    called = true;

    return result;
  };
};

export type CookieJar = ReturnType<typeof createCookieJar>;

type Cookie = {
  name: string;
  value: String;
  path: string;
  expire?: Date;
};

export const createCookieJar = () => {
  const cookies: {
    [key: string]: Cookie;
  } = {};

  return {
    setCookie(cookie: Cookie) {
      cookies[cookie.name] = {
        name: cookie.name,
        value: cookie.value,
        path: cookie.path,
        expire: cookie.expire,
      };
    },
    getSetCookieHeaders(): string[] {
      return Object.values(cookies).map((cookie) => {
        const tokens = [
          `${cookie.name}=${cookie.value}`,
          `Path=${cookie.path}`,
        ];

        if (cookie.expire) {
          tokens.push(`Expires=${cookie.expire}`);
        }

        return tokens.join("; ") + ";";
      });
    },
  };
};
