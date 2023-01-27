// @ts-nocheck
"stream" in Blob.prototype ||
    Object.defineProperty(Blob.prototype, "stream", {
        value() {
            return new Response(this).body;
        },
    }),
    "setBigUint64" in DataView.prototype ||
        Object.defineProperty(DataView.prototype, "setBigUint64", {
            value(n, e, t) {
                const i = Number(0xffffffffn & e), o = Number(e >> 32n);
                this.setUint32(n + (t ? 0 : 4), i, t),
                    this.setUint32(n + (t ? 4 : 0), o, t);
            },
        });
var n = (n) => new DataView(new ArrayBuffer(n)), e = (n) => new Uint8Array(n.buffer || n), t = (n) => new TextEncoder().encode(String(n)), i = (n) => Math.min(4294967295, Number(n)), o = (n) => Math.min(65535, Number(n));
function f(n, i) {
    if ((void 0 === i || i instanceof Date || (i = new Date(i)), n instanceof File))
        return { isFile: 1, t: i || new Date(n.lastModified), i: n.stream() };
    if (n instanceof Response)
        return {
            isFile: 1,
            t: i || new Date(n.headers.get("Last-Modified") || Date.now()),
            i: n.body,
        };
    if (void 0 === i)
        i = new Date();
    else if (isNaN(i))
        throw new Error("Invalid modification date.");
    if (void 0 === n)
        return { isFile: 0, t: i };
    if ("string" == typeof n)
        return { isFile: 1, t: i, i: t(n) };
    if (n instanceof Blob)
        return { isFile: 1, t: i, i: n.stream() };
    if (n instanceof Uint8Array || n instanceof ReadableStream)
        return { isFile: 1, t: i, i: n };
    if (n instanceof ArrayBuffer || ArrayBuffer.isView(n))
        return { isFile: 1, t: i, i: e(n) };
    if (Symbol.asyncIterator in n)
        return { isFile: 1, t: i, i: r(n) };
    throw new TypeError("Unsupported input format.");
}
function r(n) {
    const e = "next" in n ? n : n[Symbol.asyncIterator]();
    return new ReadableStream({
        async pull(n) {
            let t = 0;
            for (; n.desiredSize > t;) {
                const i = await e.next();
                if (!i.value) {
                    n.close();
                    break;
                }
                {
                    const e = s(i.value);
                    n.enqueue(e), (t += e.byteLength);
                }
            }
        },
    });
}
function s(n) {
    return "string" == typeof n ? t(n) : n instanceof Uint8Array ? n : e(n);
}
function a(n, e, i) {
    if ((void 0 === e || e instanceof Uint8Array || (e = t(e)), n instanceof File))
        return { o: u(e || t(n.name)), A: BigInt(n.size) };
    if (n instanceof Response) {
        const o = n.headers.get("content-disposition"), f = o && o.match(/;\s*filename\*?=["']?(.*?)["']?$/i), r = (f && f[1]) ||
            (n.url && new URL(n.url).pathname.split("/").findLast(Boolean)), s = r && decodeURIComponent(r), a = i || +n.headers.get("content-length");
        return { o: u(e || t(s)), A: BigInt(a) };
    }
    return ((e = u(e, void 0 !== n || void 0 !== i)),
        "string" == typeof n
            ? { o: e, A: BigInt(t(n).length) }
            : n instanceof Blob
                ? { o: e, A: BigInt(n.size) }
                : n instanceof ArrayBuffer || ArrayBuffer.isView(n)
                    ? { o: e, A: BigInt(n.byteLength) }
                    : { o: e, A: A(n, i) });
}
function A(n, e) {
    return e > -1 ? BigInt(e) : n ? void 0 : 0n;
}
function u(n, e = 1) {
    if (!n || n.every((n) => 47 === n))
        throw new Error("The file must have a name.");
    if (e)
        for (; 47 === n[n.length - 1];)
            n = n.subarray(0, -1);
    else
        47 !== n[n.length - 1] && (n = new Uint8Array([...n, 47]));
    return n;
}
var d = new WebAssembly.Instance(new WebAssembly.Module(Uint8Array.from(atob("AGFzbQEAAAABCgJgAABgAn9/AXwDAwIAAQUDAQACBwkCAW0CAAFjAAEIAQAKlQECSQEDfwNAIAEhAEEAIQIDQCAAQQF2IABBAXFBoIbi7X5scyEAIAJBAWoiAkEIRw0ACyABQQJ0IAA2AgAgAUEBaiIBQYACRw0ACwtJAQF/IAFBf3MhAUGAgAQhAkGAgAQgAGohAANAIAFB/wFxIAItAABzQQJ0KAIAIAFBCHZzIQEgAkEBaiICIABJDQALIAFBf3O4Cw"), (n) => n.charCodeAt(0)))), { c, m } = d.exports, l = e(m).subarray(65536);
function y(n, e = 0) {
    for (const t of (function* (n) {
        for (; n.length > 65536;)
            yield n.subarray(0, 65536), (n = n.subarray(65536));
        n.length && (yield n);
    })(n))
        l.set(t), (e = c(t.length, e));
    return e;
}
function B(n, e, t = 0) {
    const i = (n.getSeconds() >> 1) | (n.getMinutes() << 5) | (n.getHours() << 11), o = n.getDate() | ((n.getMonth() + 1) << 5) | ((n.getFullYear() - 1980) << 9);
    e.setUint16(t, i, 1), e.setUint16(t + 2, o, 1);
}
function w(t) {
    const i = n(30);
    return (i.setUint32(0, 1347093252),
        i.setUint32(4, 754976768),
        B(t.t, i, 10),
        i.setUint16(26, t.o.length, 1),
        e(i));
}
async function* I(n) {
    let { i: e } = n;
    if (("then" in e && (e = await e), e instanceof Uint8Array))
        yield e, (n.u = y(e, 0)), (n.A = BigInt(e.length));
    else {
        n.A = 0n;
        const t = e.getReader();
        for (;;) {
            const { value: e, done: i } = await t.read();
            if (i)
                break;
            (n.u = y(e, n.u)), (n.A += BigInt(e.length)), yield e;
        }
    }
}
function g(t, o) {
    const f = n(16 + (o ? 8 : 0));
    return (f.setUint32(0, 1347094280),
        f.setUint32(4, t.isFile ? t.u : 0, 1),
        o
            ? (f.setBigUint64(8, t.A, 1), f.setBigUint64(16, t.A, 1))
            : (f.setUint32(8, i(t.A), 1), f.setUint32(12, i(t.A), 1)),
        e(f));
}
function b(t, o, f = 0) {
    const r = n(46);
    return (r.setUint32(0, 1347092738),
        r.setUint32(4, 755182848),
        r.setUint16(8, 2048),
        B(t.t, r, 12),
        r.setUint32(16, t.isFile ? t.u : 0, 1),
        r.setUint32(20, i(t.A), 1),
        r.setUint32(24, i(t.A), 1),
        r.setUint16(28, t.o.length, 1),
        r.setUint16(30, f, 1),
        r.setUint16(40, t.isFile ? 33204 : 16893, 1),
        r.setUint32(42, i(o), 1),
        e(r));
}
function p(t, i, o) {
    const f = n(o);
    return (f.setUint16(0, 1, 1),
        f.setUint16(2, o - 4, 1),
        16 & o && (f.setBigUint64(4, t.A, 1), f.setBigUint64(12, t.A, 1)),
        f.setBigUint64(o - 8, i, 1),
        e(f));
}
function D(n) {
    return n instanceof File || n instanceof Response
        ? [[n], [n]]
        : [
            [n.input, n.name, n.size],
            [n.input, n.lastModified],
        ];
}
var predictLength = (n) => (function (n) {
    let e = BigInt(22), t = 0n, i = 0;
    for (const o of n) {
        if (!o.o)
            throw new Error("Every file must have a non-empty name.");
        if (void 0 === o.A)
            throw new Error(`Missing size for file "${new TextDecoder().decode(o.o)}".`);
        const n = o.A >= 0xffffffffn, f = t >= 0xffffffffn;
        (t += BigInt(46 + o.o.length + (n && 8)) + o.A),
            (e += BigInt(o.o.length + 46 + ((12 * f) | (28 * n)))),
            i || (i = n);
    }
    return (i || t >= 0xffffffffn) && (e += BigInt(76)), e + t;
})((function* (n) {
    for (const e of n)
        yield a(...D(e)[0]);
})(n));
function downloadZip(n, e = {}) {
    const t = {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment",
    };
    return (("bigint" == typeof e.length || Number.isInteger(e.length)) &&
        e.length > 0 &&
        (t["Content-Length"] = String(e.length)),
        e.metadata && (t["Content-Length"] = String(predictLength(e.metadata))),
        new Response(makeZip(n), { headers: t }));
}
function makeZip(t) {
    return r((async function* (t) {
        const f = [];
        let r = 0n, s = 0n, a = 0;
        for await (const n of t) {
            yield w(n), yield n.o, n.isFile && (yield* I(n));
            const e = n.A >= 0xffffffffn, t = (12 * (r >= 0xffffffffn)) | (28 * e);
            yield g(n, e),
                f.push(b(n, r, t)),
                f.push(n.o),
                t && f.push(p(n, r, t)),
                e && (r += 8n),
                s++,
                (r += BigInt(46 + n.o.length) + n.A),
                a || (a = e);
        }
        let A = 0n;
        for (const n of f)
            yield n, (A += BigInt(n.length));
        if (a || r >= 0xffffffffn) {
            const t = n(76);
            t.setUint32(0, 1347094022),
                t.setBigUint64(4, BigInt(44), 1),
                t.setUint32(12, 755182848),
                t.setBigUint64(24, s, 1),
                t.setBigUint64(32, s, 1),
                t.setBigUint64(40, A, 1),
                t.setBigUint64(48, r, 1),
                t.setUint32(56, 1347094023),
                t.setBigUint64(64, r + A, 1),
                t.setUint32(72, 1, 1),
                yield e(t);
        }
        const u = n(22);
        u.setUint32(0, 1347093766),
            u.setUint16(8, o(s), 1),
            u.setUint16(10, o(s), 1),
            u.setUint32(12, i(A), 1),
            u.setUint32(16, i(r), 1),
            yield e(u);
    })((async function* (n) {
        for await (const e of n) {
            const [n, t] = D(e);
            yield Object.assign(f(...t), a(...n));
        }
    })(t)));
}
export { downloadZip as downloadZip, makeZip as makeZip, predictLength as predictLength, };
