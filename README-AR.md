# مرسم — لوحة الإدارة Angular

لوحة إدارة عربية RTL لمشروع معرض الرسم، مبنية بـ Angular Standalone Components، ومصممة بنفس هوية مرسم: أخضر زمردي، عاجي دافئ، نحاسي، وخطوط عربية مع animations خفيفة.

## المتطلبات

- Node.js 20 أو أحدث.
- pnpm 10 أو أحدث.
- تشغيل Backend NestJS على `http://localhost:3005`.
- قاعدة البيانات والـ `.env` الخاصة بالـ Backend جاهزة في مشروع الباك إند.

## التشغيل المحلي

```bash
pnpm install
pnpm start -- --port 4200
```

افتحي:

```text
http://localhost:4200
```

رابط الـ API الافتراضي داخل Angular هو:

```text
http://localhost:3005/api/v1
```

لتغييره، عدّلي الثابت `API_BASE_URL` في:

```text
src/app/api.service.ts
```

أو قبل الـ bootstrap أضيفي قيمة `window.__API_BASE_URL__` من قالب الاستضافة.

## تسجيل الدخول

استخدمي بيانات Admin الموجودة في Backend `.env`، مثلًا:

```env
ADMIN_EMAIL=admin-test@example.com
ADMIN_PASSWORD=AdminTest12345!
```

زر **استكشاف العرض التجريبي** يعرض الواجهة فقط بدون JWT. أما تسجيل الدخول الحقيقي فيستخدم `POST /api/v1/auth/login` ويضيف Bearer token تلقائيًا عبر interceptor.

## Production build

```bash
pnpm exec ng build --configuration production
```

الملفات النهائية تكون في:

```text
dist/art-gallery-admin-angular
```

يمكن رفع محتويات هذا المجلد على Nginx أو Vercel أو Netlify. يجب ضبط rewrite إلى `index.html` لأن التطبيق Angular SPA.

## المسارات المربوطة

- `POST /api/v1/auth/login`
- `GET /api/v1/content/site-info`
- `PUT /api/v1/content/:sectionKey`
- `POST /api/v1/content/upload-image`
- `GET /api/v1/artworks`
- `GET /api/v1/artworks/home-featured`
- `GET /api/v1/artworks/:id`
- `POST /api/v1/artworks`
- `PATCH /api/v1/artworks/:id`
- `DELETE /api/v1/artworks/:id`
- `GET /api/v1/categories`
- `POST /api/v1/categories`
- `DELETE /api/v1/categories/:id`
- `GET /api/v1/orders`
- `GET /api/v1/orders/:id`
- `PATCH /api/v1/orders/:id/status`
- `GET /api/v1/courses/admin/all`
- `POST /api/v1/courses`
- `PATCH /api/v1/courses/:id`
- `DELETE /api/v1/courses/:id`

## ملاحظة CORS

في Backend ضعي:

```env
CORS_ORIGIN=http://localhost:4200
```

ولو Frontend وBackend على أكثر من origin، افصلي القيم بفاصلة حسب إعداد Backend الحالي.

## التشغيل باستخدام Docker بدون تحديث Node

لا تحتاجي Node أو pnpm على جهازك عند استخدام Docker. من داخل مجلد المشروع نفذي:

```bash
docker compose up --build -d
```

ثم افتحي:

```text
http://localhost:4200
```

التأكد من أن الحاوية تعمل:

```bash
docker compose ps
docker compose logs -f art-gallery-admin
```

اختبار Nginx:

```text
http://localhost:4200/health
```

إيقاف الحاوية:

```bash
docker compose down
```

الـ Dockerfile يستخدم Node 20 داخل الحاوية في مرحلة البناء، ثم Nginx فقط في التشغيل؛ لذلك نسخة Node الموجودة عندك على الجهاز لا تؤثر. يجب أن يظل Backend شغالًا على جهازك على `http://localhost:3005`، لأن المتصفح هو الذي يرسل طلبات API من جهازك.

## Enterprise Architecture

التطبيق مقسم إلى طبقات واضحة:

```text
src/app/core       الخدمات singleton والـ guards والـ interceptors والـ models
src/app/shared     مكونات UI وpipes قابلة لإعادة الاستخدام
src/app/features   auth/artworks/categories/orders/courses/content
```

الـ API services موجودة داخل كل Feature، بينما `HttpBaseService` مسؤول عن Base URL وفك `SuccessResponse` القادم من NestJS. الـ `AuthInterceptor` يضيف `access_token` تلقائيًا، و`ErrorInterceptor` يتعامل مع 401 والأخطاء العامة.

لذلك عند تشغيل Backend محليًا على `http://localhost:3005` لا تحتاجي تعديل الرابط في كل Feature؛ الرابط المركزي موجود في:

```text
src/app/core/services/http-base.service.ts
```
