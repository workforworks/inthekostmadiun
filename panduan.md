# 📘 Panduan Standar Pengodean & Pengembangan Proyek (Coding Standard)

Dokumen ini disusun sebagai acuan utama bagi seluruh anggota tim pengembang agar kode proyek tetap bersih (*Clean Code*), modular, konsisten, dan mudah dirawat.

---

## 📌 1. Prinsip Utama & Konvensi Penamaan

### Prinsip Utama

- **Bahasa Pengodean:** Seluruh nama fungsi, variabel, kelas, file, folder, serta *commit message* **WAJIB menggunakan bahasa Inggris**.
- **Keutuhan Arsitektur:** Jangan mengubah setup bawaan yang sudah disediakan (`Auth`, `Parent Layout`, `Theme Setup`, dan skema basis data awal).
- **Pengembangan Fitur:** Selalu kembangkan fitur di atas pondasi dan struktur yang sudah tersedia.
- **Clean Code:** Kode harus mudah dibaca, dipahami, diuji, dan dirawat.
- **Single Responsibility:** Setiap class, function, component, dan module harus memiliki tanggung jawab yang jelas.
- **Reusable:** Hindari duplikasi kode dengan memanfaatkan component, helper, service, atau utility yang dapat digunakan kembali.

### Standar Penamaan File & Folder

| Kategori / Komponen | Konvensi Case | Contoh |
| :--- | :--- | :--- |
| **Backend (Controller)** | PascalCase | `PropertyController.php` |
| **Backend (Model)** | PascalCase (Singular) | `Property.php` |
| **Backend (Migration)** | snake_case (Plural) | `2025_01_01_000006_create_properties_table.php` |
| **Backend (Request)** | PascalCase | `StorePropertyRequest.php` |
| **Backend (Service)** | PascalCase | `PropertyService.php` |
| **Frontend (Pages)** | PascalCase | `Dashboard.jsx` |
| **Frontend (Components)** | PascalCase | `PropertyCard.jsx` |
| **Frontend (Hooks)** | camelCase | `usePropertyFilter.js` |
| **Frontend (Utilities)** | camelCase | `formatCurrency.js` |
| **Route Names** | dot.notation | `admin.dashboard` |
| **Database Table** | snake_case, plural | `properties` |
| **Database Column** | snake_case | `owner_id` |
| **Function / Method** | camelCase | `getAvailableProperties()` |
| **Variable** | camelCase | `propertyList` |
| **Constant** | UPPER_SNAKE_CASE | `MAX_UPLOAD_SIZE` |

---

## 📂 2. Struktur Direktori Berbasis Role

Proyek ini membagi hak akses dan modul menjadi 3 role utama:

- **Admin**
- **Owner**
- **User**

Struktur utama proyek:

```text
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Admin/
│   │   │   ├── Auth/
│   │   │   ├── Owner/
│   │   │   └── User/
│   │   │
│   │   └── Requests/
│   │       ├── Admin/
│   │       ├── Owner/
│   │       └── User/
│   │
│   ├── Models/
│   └── Services/
│
├── resources/
│   ├── css/
│   │   └── app.css
│   │
│   └── js/
│       ├── Components/
│       │   ├── Admin/
│       │   ├── Owner/
│       │   ├── User/
│       │   └── ...
│       │
│       ├── Layouts/
│       │   ├── AuthDashboardLayout.jsx
│       │   ├── AuthenticatedLayout.jsx
│       │   ├── AuthPageLayout.jsx
│       │   └── GuestLayout.jsx
│       │
│       ├── Pages/
│       │   ├── Admin/
│       │   ├── Owner/
│       │   ├── User/
│       │   └── Auth/
│       │
│       ├── Hooks/
│       └── Utils/
│
├── routes/
│   ├── web.php
│   └── auth.php
│
└── database/
    ├── migrations/
    └── seeders/
```

### Aturan Peletakan File

#### 1. Controller

Controller baru **WAJIB** ditempatkan berdasarkan role:

```text
app/Http/Controllers/Admin/
app/Http/Controllers/Owner/
app/Http/Controllers/User/
```

Contoh:

```text
app/Http/Controllers/Admin/DashboardController.php
app/Http/Controllers/Owner/PropertyController.php
app/Http/Controllers/User/SurveyRequestController.php
```

#### 2. Pages

Halaman Inertia yang spesifik terhadap role ditempatkan berdasarkan role:

```text
resources/js/Pages/Admin/
resources/js/Pages/Owner/
resources/js/Pages/User/
```

Contoh:

```text
resources/js/Pages/Admin/Dashboard.jsx
resources/js/Pages/Owner/Properties/Index.jsx
resources/js/Pages/User/Surveys/Create.jsx
```

#### 3. Components

Component yang hanya digunakan oleh satu role ditempatkan pada folder role terkait:

```text
resources/js/Components/Admin/
resources/js/Components/Owner/
resources/js/Components/User/
```

Component yang bersifat umum dan reusable ditempatkan pada:

```text
resources/js/Components/
```

Contoh:

```text
resources/js/Components/Modal.jsx
resources/js/Components/PrimaryButton.jsx
resources/js/Components/Dropdown.jsx
resources/js/Components/EmptyState.jsx
```

### Prinsip Reusable Component

Gunakan component bersama jika component tersebut digunakan oleh lebih dari satu role atau module.

```text
Components/
├── Modal.jsx
├── PrimaryButton.jsx
├── SecondaryButton.jsx
├── InputLabel.jsx
├── TextInput.jsx
├── EmptyState.jsx
└── LoadingSpinner.jsx
```

Jangan membuat component yang sama berulang kali hanya karena digunakan pada halaman berbeda.

---

## 🗄️ 3. Skema Database & Eloquent Model

Seluruh file migrasi yang sudah disediakan harus dianggap sebagai bagian dari struktur dasar aplikasi.

Pengembang **TIDAK BOLEH mengubah struktur database awal secara sembarangan**.

Jika terdapat kebutuhan perubahan database:

1. Buat migration baru.
2. Jangan mengubah migration lama yang sudah digunakan.
3. Pastikan migration dapat di-*rollback*.
4. Pastikan perubahan tidak merusak data atau relasi yang sudah ada.

### Model

Setiap tabel utama harus memiliki Eloquent Model yang sesuai.

Contoh:

```text
app/Models/
├── User.php
├── Property.php
├── PropertyImage.php
├── PropertyVerification.php
├── SurveyRequest.php
└── SurveyPackage.php
```

### Ketentuan Model

Setiap model harus:

- Menggunakan `$fillable` atau `$guarded` secara eksplisit.
- Mendefinisikan relasi dengan jelas.
- Menggunakan return type pada relationship.
- Menggunakan nama relasi yang representatif.
- Tidak memasukkan business logic kompleks ke dalam model jika lebih tepat ditempatkan di Service.

### Contoh Model

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Property extends Model
{
    protected $fillable = [
        'owner_id',
        'title',
        'price',
        'location_id',
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function images(): HasMany
    {
        return $this->hasMany(PropertyImage::class);
    }
}
```

### Penamaan Relationship

Gunakan nama relationship yang jelas dan menggambarkan data yang dikembalikan.

```php
public function owner(): BelongsTo
{
    return $this->belongsTo(User::class, 'owner_id');
}

public function images(): HasMany
{
    return $this->hasMany(PropertyImage::class);
}

public function surveyRequests(): HasMany
{
    return $this->hasMany(SurveyRequest::class);
}

public function propertyVerifications(): HasMany
{
    return $this->hasMany(PropertyVerification::class);
}
```

Hindari nama yang terlalu umum:

```php
// ❌ Hindari
public function data()
{
    //
}

public function item()
{
    //
}
```

Gunakan nama yang spesifik:

```php
// ✅ Gunakan
public function surveyRequests(): HasMany
{
    return $this->hasMany(SurveyRequest::class);
}
```

---

## 🧩 4. Controller & Business Logic

Controller digunakan untuk menangani HTTP request dan mengatur alur komunikasi antara request, service, model, dan response.

Controller **jangan menjadi tempat untuk seluruh business logic aplikasi**.

### Contoh Struktur

```text
Controller
    ↓
Request Validation
    ↓
Service
    ↓
Model
    ↓
Database
```

### Controller

```php
public function store(StorePropertyRequest $request)
{
    $property = $this->propertyService->create(
        $request->validated()
    );

    return redirect()
        ->route('owner.properties.index')
        ->with('success', 'Property created successfully.');
}
```

### Service

Business logic yang kompleks dapat ditempatkan pada:

```text
app/Services/
```

Contoh:

```text
app/Services/
├── PropertyService.php
├── SurveyService.php
└── UserService.php
```

Tujuannya agar Controller tetap sederhana dan mudah dipahami.

---

## 🛡️ 5. Form Request & Validasi

Validasi input **WAJIB** dilakukan sebelum data diproses atau disimpan.

Untuk validasi sederhana, gunakan Form Request Laravel.

Contoh:

```text
app/Http/Requests/Owner/StorePropertyRequest.php
```

Contoh implementasi:

```php
<?php

namespace App\Http\Requests\Owner;

use Illuminate\Foundation\Http\FormRequest;

class StorePropertyRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'price' => ['required', 'numeric', 'min:0'],
            'location_id' => ['required', 'exists:locations,id'],
        ];
    }
}
```

### Jangan melakukan validasi seperti ini secara berulang di Controller

```php
// ❌ Hindari jika validasi sudah kompleks
$request->validate([
    'title' => 'required',
    'price' => 'required',
]);
```

Gunakan Form Request:

```php
// ✅
public function store(StorePropertyRequest $request)
{
    //
}
```

---

## 🎨 6. Standar Styling — Tailwind CSS

Project menggunakan Tailwind CSS dengan sistem warna berbasis semantic theme.

### Larangan Hardcode Warna

Jangan menggunakan warna hex secara langsung:

```jsx
// ❌ SALAH
<button className="bg-[#2563EB] text-white">
    Simpan
</button>
```

Jangan menggunakan warna Tailwind secara langsung jika sudah tersedia semantic color:

```jsx
// ❌ SALAH
<button className="bg-blue-600 text-white">
    Simpan
</button>
```

Gunakan semantic color:

```jsx
// ✅ BENAR
<button className="bg-primary text-on-primary hover:bg-primary-hover">
    Simpan
</button>
```

### Semantic Color

Gunakan warna yang sudah disediakan oleh:

```text
resources/css/app.css
```

Contoh:

```text
bg-background
text-body
text-primary
bg-primary
bg-primary-light
text-on-primary
hover:bg-primary-hover
border-border
```

### Tujuan

Dengan menggunakan semantic color:

- Theme lebih mudah dikelola.
- Warna dapat berubah berdasarkan role.
- Tidak terjadi duplikasi warna.
- Konsistensi UI lebih terjaga.
- Perubahan branding lebih mudah dilakukan.

---

## 🌓 7. Role-Based Theme

Layout utama akan menentukan theme berdasarkan role user.

Contoh konsep:

```jsx
<AuthenticatedLayout>
    {children}
</AuthenticatedLayout>
```

Theme harus dikelola melalui sistem yang sudah tersedia.

Jangan membuat sistem theme baru apabila sistem theme sudah tersedia di project.

### Prinsip

```text
User Login
    ↓
Role Detection
    ↓
Theme Configuration
    ↓
AuthenticatedLayout
    ↓
Semantic Color
    ↓
UI Component
```

Contoh penggunaan:

```jsx
<div className="bg-background text-body">
    <h1 className="text-primary">
        Dashboard
    </h1>
</div>
```

---

## 🧱 8. Standar React / Inertia

Frontend menggunakan React dan Inertia.

### Component

Component harus memiliki tanggung jawab yang jelas.

```jsx
function PropertyCard({ property }) {
    return (
        <div className="rounded-lg bg-background">
            <h3 className="text-primary">
                {property.title}
            </h3>
        </div>
    );
}

export default PropertyCard;
```

### Hindari Component Terlalu Besar

Jangan membuat satu file seperti:

```text
Dashboard.jsx
```

yang berisi:

- Sidebar
- Header
- Table
- Modal
- Form
- Chart
- Filter
- Pagination
- Notification

Pisahkan menjadi component yang lebih kecil:

```text
Dashboard.jsx
├── DashboardHeader.jsx
├── StatisticCard.jsx
├── PropertyTable.jsx
├── PropertyFilter.jsx
└── RecentActivity.jsx
```

---

## 🔄 9. State Management

Gunakan state lokal jika state hanya digunakan oleh satu component.

```jsx
const [isOpen, setIsOpen] = useState(false);
```

Jangan membuat global state jika tidak diperlukan.

Gunakan state global hanya apabila data memang dibutuhkan oleh banyak bagian aplikasi.

### Prinsip

```text
Local State
    ↓
Component State
    ↓
Shared State
    ↓
Global State
```

Gunakan solusi paling sederhana yang memenuhi kebutuhan.

---

## 📡 10. API / Request Handling

Semua request harus memiliki handling untuk:

- Loading
- Success
- Error
- Validation
- Empty state

Contoh konsep:

```text
User Action
    ↓
Request
    ↓
Loading State
    ↓
Success / Error
    ↓
UI Feedback
```

User harus mendapatkan feedback setelah melakukan action penting seperti:

- Create
- Update
- Delete
- Approve
- Reject
- Upload
- Submit Survey

---

## 📝 11. Error Handling

Error harus ditangani dengan jelas.

### Backend

Gunakan Laravel validation dan exception handling sesuai kebutuhan.

### Frontend

Jangan membiarkan error terjadi tanpa feedback kepada user.

Contoh:

```jsx
{errors.title && (
    <p className="text-error">
        {errors.title}
    </p>
)}
```

### User Feedback

Gunakan notifikasi yang jelas:

```text
✅ Property berhasil ditambahkan.
⚠️ Data belum lengkap.
❌ Gagal menghapus property.
```

Hindari pesan teknis kepada user:

```text
❌ SQLSTATE[23000]...
```

Pesan teknis hanya digunakan untuk debugging/logging.

---

## 🖼️ 12. File Upload

File upload harus memiliki:

- Validasi tipe file.
- Validasi ukuran.
- Penamaan file yang aman.
- Penyimpanan pada lokasi yang sesuai.
- Handling jika upload gagal.

Contoh validasi:

```php
'image' => [
    'required',
    'image',
    'mimes:jpg,jpeg,png,webp',
    'max:2048',
],
```

Jangan mempercayai ekstensi file dari user tanpa validasi.

---

## 🔐 13. Authentication & Authorization

Authentication dan authorization harus mengikuti sistem yang sudah disediakan.

Jangan membuat sistem authentication baru jika project sudah memiliki:

```text
Auth
Middleware
Role
Permission
AuthenticatedLayout
```

### Role

Role utama:

```text
admin
owner
user
```

Setiap role hanya boleh mengakses module yang menjadi haknya.

Contoh:

```text
Admin
├── Dashboard
├── Users
├── Properties
├── Survey
└── Verification

Owner
├── Dashboard
├── Properties
├── Survey
└── Profile

User
├── Dashboard
├── Properties
├── Survey
└── Profile
```

### Authorization

Jangan hanya mengandalkan frontend untuk keamanan.

```jsx
// ❌ Tidak cukup
{user.role === 'admin' && (
    <AdminButton />
)}
```

Backend tetap harus melakukan authorization.

```php
$this->authorize('update', $property);
```

---

## 🛣️ 14. Routing Convention

Gunakan nama route yang konsisten.

Format:

```text
[role].[module].[action]
```

Contoh:

```text
admin.dashboard

admin.users.index
admin.users.create
admin.users.store
admin.users.show
admin.users.edit
admin.users.update
admin.users.destroy

owner.properties.index
owner.properties.create
owner.properties.store
owner.properties.show
owner.properties.edit
owner.properties.update
owner.properties.destroy

user.surveys.index
user.surveys.create
user.surveys.store
user.surveys.show
```

### RESTful Convention

Gunakan pola standar Laravel:

```text
GET       /properties
POST      /properties
GET       /properties/{property}
PUT/PATCH /properties/{property}
DELETE    /properties/{property}
```

---

## 🧪 15. Testing

Setiap fitur yang dibuat harus diuji sebelum masuk Pull Request.

### Backend

```text
✓ Validation
✓ Authorization
✓ Database operation
✓ Relationship
✓ Business logic
```

### Frontend

```text
✓ Rendering
✓ Form interaction
✓ Loading state
✓ Error state
✓ Empty state
✓ Responsive layout
```

### Manual Testing

Sebelum membuat PR:

```text
✓ Login berhasil
✓ Role berjalan sesuai
✓ Route tidak error
✓ Form berjalan
✓ Validation berjalan
✓ Data tersimpan
✓ Data dapat di-update
✓ Data dapat dihapus
✓ Tidak ada error console
✓ Tidak ada error Laravel log
```

---

## 📦 16. GitHub & Git Workflow

Git digunakan untuk menjaga histori perubahan kode dan mempermudah proses Code Review.

### Branch

Gunakan format:

```text
feature/[role]-[feature]
```

Contoh:

```text
feature/admin-user-management
feature/owner-add-property
feature/owner-property-gallery
feature/user-survey-request
feature/admin-survey-approval
```

Untuk bug:

```text
fix/[role]-[issue]
```

Contoh:

```text
fix/owner-property-validation
fix/user-survey-form
```

Untuk refactor:

```text
refactor/[module]-[description]
```

Contoh:

```text
refactor/property-service
refactor/dashboard-components
```

---

## 🔀 17. Pull Request

### Aturan Utama

> **1 PR = 1 Fitur / 1 Scope Perubahan**

Jangan menggabungkan banyak fitur yang tidak berkaitan dalam satu PR.

### Contoh yang Benar

```text
PR #15
feat: add property creation for owner
```

Berisi:

```text
✓ PropertyController
✓ StorePropertyRequest
✓ PropertyService
✓ Create Property Page
✓ Property Form
✓ Validation
```

### Contoh yang Salah

```text
PR #15
feat: update owner dashboard, add property,
add survey, redesign sidebar, fix authentication,
update user profile
```

PR terlalu besar dan sulit direview.

---

## 📝 18. Commit Message Convention

Commit message **WAJIB menggunakan Bahasa Inggris**.

Gunakan format:

```text
type: description
```

### Commit Types

| Type | Penggunaan |
| :--- | :--- |
| `feat` | Menambahkan fitur baru |
| `fix` | Memperbaiki bug |
| `refactor` | Refactor kode tanpa mengubah behavior |
| `style` | Perubahan styling/formatting |
| `docs` | Perubahan dokumentasi |
| `test` | Menambahkan atau memperbaiki testing |
| `chore` | Maintenance project |
| `perf` | Peningkatan performa |
| `build` | Perubahan build/dependency |
| `ci` | Perubahan CI/CD |

### Contoh

```text
feat: add property creation form
feat: add survey request management
fix: resolve property image upload validation
fix: prevent unauthorized property access
refactor: extract property service
refactor: split dashboard statistic component
style: improve property card spacing
docs: update coding standard
test: add property creation feature test
chore: update project dependencies
```

### Hindari Commit Message

```text
// ❌ Jangan
update
fix
testing
changes
baru
coba
final
final fix
fix lagi
```

Commit message harus menjelaskan perubahan yang dilakukan.

---

## 🔍 19. Code Review

Sebelum membuat Pull Request, developer wajib melakukan pengecekan mandiri.

### Self Review Checklist

- [ ] Tidak ada `console.log()` yang tidak diperlukan.
- [ ] Tidak ada `dd()` atau `dump()` yang tertinggal.
- [ ] Tidak ada password atau credential di dalam source code.
- [ ] Tidak ada hardcoded secret/API key.
- [ ] Tidak ada kode duplikat yang tidak diperlukan.
- [ ] Nama variable dan function menggunakan Bahasa Inggris.
- [ ] Component memiliki tanggung jawab yang jelas.
- [ ] Validation sudah diterapkan.
- [ ] Authorization sudah diterapkan.
- [ ] Error handling sudah diterapkan.
- [ ] Loading state sudah tersedia jika diperlukan.
- [ ] Empty state sudah tersedia jika diperlukan.
- [ ] Responsive layout sudah diperiksa.
- [ ] Tidak ada error pada browser console.
- [ ] Tidak ada error pada Laravel log.
- [ ] Migration dapat dijalankan.
- [ ] Migration dapat di-rollback jika diperlukan.

---

## 📊 20. Prinsip UI/UX

Setiap halaman harus memperhatikan:

### Visual Hierarchy

Gunakan hierarki yang jelas:

```text
Page Title
    ↓
Description / Context
    ↓
Primary Action
    ↓
Content
    ↓
Secondary Information
```

### Consistency

Gunakan component yang sudah tersedia.

Jangan membuat variasi button sendiri jika sudah tersedia:

```text
PrimaryButton
SecondaryButton
DangerButton
```

### Responsive

Setiap halaman harus dapat digunakan pada:

```text
Mobile
Tablet
Desktop
```

Hindari layout yang hanya cocok untuk desktop.

---

## ♿ 21. Accessibility

UI harus mempertimbangkan accessibility.

Gunakan:

```jsx
<button type="button">
    Simpan
</button>
```

Bukan:

```jsx
<div onClick={handleSave}>
    Simpan
</div>
```

Untuk image:

```jsx
<img
    src={property.image}
    alt={property.title}
/>
```

Pastikan:

- Button dapat dikenali.
- Input memiliki label.
- Image memiliki `alt`.
- Kontras warna cukup.
- Keyboard navigation tidak rusak.
- Error form mudah dipahami.

---

## 🚀 22. Performance

Hindari operasi yang tidak diperlukan.

### Backend

Hindari N+1 Query.

```php
// ❌
$properties = Property::all();

foreach ($properties as $property) {
    echo $property->owner->name;
}
```

Gunakan eager loading:

```php
// ✅
$properties = Property::with('owner')->get();
```

### Frontend

Hindari rendering component yang tidak diperlukan.

Gunakan:

- Pagination
- Lazy loading
- Image optimization
- Debounce untuk search
- Reusable component

sesuai kebutuhan.

---

## 🔒 23. Security

Jangan menyimpan data sensitif di source code.

```text
❌ Password
❌ API Key
❌ Secret Key
❌ Database Credential
❌ Private Token
```

Gunakan `.env`.

Contoh:

```env
DB_DATABASE=database_name
DB_USERNAME=username
DB_PASSWORD=password
```

Pastikan `.env` tidak di-*commit* ke GitHub.

### Jangan Commit

```text
.env
/vendor
/node_modules
```

Pastikan `.gitignore` sudah menangani file tersebut.

---

## 📁 24. File & Component Organization

Jika sebuah module semakin besar, gunakan struktur folder.

Contoh:

```text
Pages/
└── Owner/
    └── Properties/
        ├── Index.jsx
        ├── Create.jsx
        ├── Edit.jsx
        ├── Show.jsx
        └── Components/
            ├── PropertyForm.jsx
            ├── PropertyImageUpload.jsx
            └── PropertyInformation.jsx
```

Untuk component:

```text
Components/
└── Owner/
    └── Property/
        ├── PropertyCard.jsx
        ├── PropertyStatusBadge.jsx
        ├── PropertyActions.jsx
        └── PropertyImageGallery.jsx
```

Tujuannya agar struktur tetap mudah dinavigasi ketika project berkembang.

---

## 📚 25. Dokumentasi

Setiap fitur yang kompleks harus memiliki dokumentasi yang cukup.

Dokumentasi dapat menjelaskan:

```text
Purpose
Architecture
Business Logic
Database Relationship
Permission
Usage
Known Limitation
```

Dokumentasi tidak perlu menjelaskan kode yang sudah jelas.

Fokus pada hal yang membantu developer lain memahami sistem.

---

## 🚫 26. Hal yang Dilarang

Developer **DILARANG**:

- Mengubah authentication tanpa alasan yang jelas.
- Mengubah Parent Layout tanpa koordinasi.
- Mengubah Theme System tanpa koordinasi.
- Mengubah database schema awal tanpa migration.
- Menyimpan secret di source code.
- Menggunakan hardcoded color jika semantic color sudah tersedia.
- Membuat duplicate component tanpa alasan.
- Mengabaikan authorization.
- Mengabaikan validation.
- Membuat Controller terlalu kompleks.
- Membuat PR yang terlalu besar.
- Menggunakan commit message yang tidak jelas.
- Menyimpan `console.log()` untuk debugging di production code.
- Menyimpan `dd()` atau `dump()` di production code.
- Menggunakan Bahasa Indonesia untuk nama variable, function, class, file, atau route.

---

## ✅ 27. Definition of Done

Sebuah fitur dianggap **SELESAI** apabila:

- [ ] Requirement fitur sudah terpenuhi.
- [ ] Struktur file mengikuti coding standard.
- [ ] Nama file menggunakan konvensi yang benar.
- [ ] Nama variable/function/class menggunakan Bahasa Inggris.
- [ ] Validation sudah tersedia.
- [ ] Authorization sudah tersedia.
- [ ] Database operation sudah diuji.
- [ ] Relationship sudah benar.
- [ ] UI responsive.
- [ ] Loading state sudah tersedia jika diperlukan.
- [ ] Empty state sudah tersedia jika diperlukan.
- [ ] Error handling sudah tersedia.
- [ ] Success feedback sudah tersedia.
- [ ] Tidak terdapat hardcoded color yang melanggar theme.
- [ ] Tidak ada debug code.
- [ ] Tidak ada error pada browser console.
- [ ] Tidak ada error pada Laravel log.
- [ ] Sudah diuji secara lokal.
- [ ] Commit message mengikuti standard.
- [ ] Branch mengikuti naming convention.
- [ ] Pull Request hanya memiliki satu scope fitur.
- [ ] Code sudah siap untuk direview.

---

# 🏁 28. Prinsip Akhir

Gunakan prinsip berikut sebagai pedoman utama selama development:

> **Write code that is easy to read, easy to test, easy to change, and easy for another developer to understand.**

Prioritas development:

```text
Correctness
    ↓
Security
    ↓
Maintainability
    ↓
Readability
    ↓
Performance
    ↓
Optimization
```

Jangan mengejar kode yang terlihat kompleks hanya agar terlihat "advanced".

Kode yang baik adalah kode yang:

```text
Simple
    +
Consistent
    +
Secure
    +
Reusable
    +
Maintainable
```

Dengan standar ini, setiap developer dalam tim harus dapat melanjutkan pekerjaan developer lain tanpa harus memahami seluruh project dari awal.
