# PGP - Pretty Good Proposal V2

Mange different proposals tracks with a simple web application [License](./LICENSE).

First build to manage [Chaotic Catalyst Scholarships (CCS)](https://chaos-stipendien.de/).

You can see a running version [bewerben.c3fl.de](https://bewerben.c3fl.de). You can find a very [short talk (2:40 Minutes) from cccamp23 on youtube](https://youtu.be/y4a9_POxGws?si=DWvt5urfD1hWnc-6)

## Features

- Create Tracks
- Create proposals
- Encyrpt proposals with [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API). For more infomration please have a look at the [lib](./src/lib/) Folder and different files.
- Save encrypted proposals to a database.
- Only advisary board can decrypt proposals (with a manuel shared private)
- Advisary board can vote and decide on proposals
- Every Track has a custom URL and public key
- A root user can create tracks, users (advisary board) and connect them both
- You can easily export all track data as json

> This is a work in progress. The application could be setup for other projects. Please be aware that this is a very early version. There is no guarantee that this application is secure. Only use it if encrytion is a nice to have feature!!!

## Technical Setup

### Frontend

The Frontendn is a Vue3 (JavaScript) which is completly standalone.

### Install

`npm i`

### Backend

The Backend is a Laravel application. It uses a sqllite as database.

#### Requirements

1. [PHP Composer](https://getcomposer.org) installed
2. [PHP SQLite](https://dev.to/nkrumahthis/how-to-install-php-sqlite3-for-php-81-on-ubuntu-2110-50fp) installed
3. PHP Extensions installed

```
sudo apt install openssl php-bcmath php-curl php-json php-mbstring php-mysql php-tokenizer php-xml php-zip
```

#### Install

1. Composer install dependecies. `composer update`
2. Copy .env.example to .env (for local development use .env.example.local.dev)
3. For local development: create `backend/database/database.sqlite`
4. You can create test data by seeding: `php artisan migrate:fresh --seed` (Deletes the database and seeds new Data)
5. Generate a key with this command: `php artisan key:generate`
6. Start the development server: `php artisan serve`

You can use the following Private Key for local development:

```
{"alg":"RSA-OAEP-512","d":"TD6MEN65iy9OFv5Qoz6AXTtaS4DbTuA6wXmMhJMT6M-uiWJ0vjRKOS9xSHkwEg7xWRLIOPmad2oNo9rt7GY6p_bFtYDZ0p4Ug9ji_I-O8TuppRYtROq8uuj8ALSsTFQR2QbCp1QnJOItt0bl05P5LzJ-L3iYwo2RIDbGq5sDRC0Gv0RK0ubUY8OhDpqLh0FUROYcSrT6oKCN4JVs4zD3YIQjOJB6BcbOncn5DT1cnN96sZa9cou7x388ED0DgFTIj564rs7n7iEraoklUTKzT6RPkx5kRmcHpGuMpRfusaWt-Hf1TAP3JFrfg0L__J7SEWnm0n10LyBsqJS1H72oeHP29GWkA80c8XG0g6Quu-DuK8AR-PNhd85qQBgAnSkrUrgWHsIK7nqVX9ljs2ZYmd1k5ZyR9okIDskT6pL1G397O8yMxP3vQo1vqqz8khRm_kIAivqSAPv0GcHlKwycLRio_VJijHWck_NQ6L3gizjDnPNxQSvFtQ92nIiTD17Gz40h5IDWOYNBmui_mKnb08FF_wmm07a9lOnICurdTeMQ-GXVxPB3eRpp9l683zNc7JSpxDbbp21v9es6Y2fc_jiIyn8ICh4QMbYNu2wtUQg--G9HtMgjtj9lW4-LsPu3WlcI3pLXX5UfuNEwcap4YQjkq4TqH-aPHb5O2nCpXsE","dp":"4s7epiqFPlLWo-6DR12V6zUcrkime2-X3whE7bfhInPvlCPY1J2JnTkrEpuwdPtZ2wI55nsVgG7kfo4J_gPFtAPob8SEogQSIT0zGdfpu7lJs-FqGYEAsi6Fesoxlko67gT0glPwXBGJN9BUD6FSG-Em_9kWm3MKZt-c344eynzu3RPjWVwHRQC3l9X-UkIOpKIlHARTUihkhp11-Riomh3TLWXk6w_osijYyWg4zBCYnynp0PhsmceEL-pKBbtkbrbrdEEWqbgEToHKI9cmrDHnOqUV1tAG2Lw0a2-HkeJc6_Jjsx3WeXqEEhPlQPO6ASmYA6taByTHFa_sgJcqxQ","dq":"BVSKTaWzIrdjoj6fJS0jb2O0v5vU640OQFnwZOl9I15pYhYalXMVT1oOYaIXSz61I53GCkBelAZ96OTgOEVKLJeeyy4W5wLFAY9Z22xCDYGb1uy0ZnLU_Qs5q1v7XZNockT44UWWjZs99UcehJF5n3INMK8yiHbpU6OQVwUkNevilvi1M_KoTIA-xTc5EYaweMRBQ7gDQcFBVLKFE1Wo2iAAibDQMBkTPliNr7oClvh8xpq6gd_1pbUrl8vpQuq4_w3XubYpIqbEoGiAnQg_9B58QDpQ5L2faoDzDSPCVAhrGVNpUXo4Q-DIEqz1tadaInp1B7IBRVFAypMhTBqvEQ","e":"AQAB","ext":true,"key_ops":["decrypt"],"kty":"RSA","n":"yH-fhNikSkvSIMrjxJPfVQdz4KQYEy71xBi258Y8JugEsewNkN32e5G-oLin63IdygLuOhONX9fzKLQmH3mhxCYwKH-H5MxyKa2GJbQ6b3_AkUk5CqmWgJ-oVcyRYVy85MkKj4JBIqvmDBYTYMK5i7eTYgtiQPF41o_BkgYxVq21ty6NyX4x8uSfhv29004Kybn09Kb0fcM3FyVig-mCkq4MAUVH3aimiV0n07DNDZSh0Pf_mjIRvgCSGq1jtt2uEwQ281x0vgDL6u1yeamOQDeLDqCGfWTfOfzY3r66rg2trmstGBHyZzFywr4mAK-t_YjOOcXYucQXWTIqaFn8P5-hj8Y9o_2mz-PDZDi6fhRFoGRufQrEvKOP8kAOgBp2hJkohV_LPTL_wxiqjzQIwI2iQAVyEy6E82es4fZw3unV7sSWaaDLy2XO_UCvWYC6WAlcxFKj2kZkCHYXQMgm2aabzPzuzPoiNe2XrMNPUZBlkH-vFDN1qJ0Ch0WlhrD8biKS98gWDJoOKX4ra2HPTCR5RBGvq4WqnPXekAWBbYeAlIQbgyuOq-t5UtBFK61iBAI3JWc_NgHvelgWu5vhcOCr4Y7z1XNDpkAVza4X-66SE-hpQvbMlaGr4oxM5GbCT__aj7jG7epqSFKkZnrZmCwey60CYFQz-_mUt6peF-M","p":"_cCsPpZDiFxSOZ9PMDCnt0HpV48p6TbBj4up_B9s_sotHmNdtW_Bvq-QCI9tX2JRDVRgN-QVM8oBXq3is787VpTesEhAJhOdQXjWsnD-v58_xFVnNi2nBLCyNOnYMq0wcxgbyqZpvg13SYpaQQkE36ps_4mB3BV1DVsDd2HBTGY8Dk-7iFKVNF06hRtks0Bgqf0Es_2DyoZD-qjVb7BLUfPftZIbd36oQ2nRAOeY83IuD7EGeMkpC9ON86JhYvUKR36LomRNEYBc4yyffGiv34XbpFlCinUYQhdlAx7A36jwh9vq8SgZe_h49BGwFKqycxfJuiSutzZ4wHYKgiB6Ew","q":"ykY1ZFrV0KSXcNgI3TUCmSWGDNWJBl7XJdPv0ge3Mi8_9m_eIu8Q0J6SHNPQw19fEOK_OblEZPUrV20d9wiD6SQ57gve9W1AO_B_TKdtNqXszwPm-J9qj9GPbcomeaqe2-SZT1_hpBCJo12BXKUpMn_fM36fvv2-29CP35uuCTRnAFcv-gzI4WVupp0riyff5pyKJm8GCwuTMHNK1iikzeAUaSZf5OmE4UkViRJHmBl1ajXTUqKwpUD4lVinCL5RysKZNTL4Q5SSVUDt_qVHWu62IxE2jvlaSw9_pIL1vbOt1ym_zFibETO58_9204n5c9vCD5HbbxrYsUawSO2k8Q","qi":"VAukOsv3nA5P7FALM6S-eRxN23qYQEf70AGT2pbXg51xlLjVHFCczYb8HzFSyZYwV83ECRFldBAnWdWRo7GxCwxiHtnGuXF5UCBPW3bxL8630TvzmIbXwbYtSs5iLLX3m0uceWxtaplSqZNXpm1j9VE0_w2dEu0uOR6KZDVgV6lY_7IcVGtItcMcOc-4DgUObB0djWCBhmQoC4nekz4FV1kJZP0zDMVN1vbvSpoLIW1pUxzNit3_TOjATfxVtFTSrHsVvxqQZwNj1bWZl_5nmGL3z8HYHkDcCR8Uq5iRu3ylxpzBzaCISyQvcYLhhOypHVD8NMyEReQ1_XDV1YQzxw"}
```
