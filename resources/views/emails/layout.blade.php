<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <title>{{ $title ?? config('app.name', 'InTheKost Madiun') }}</title>
    <style>
        /* Base Resets */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; }
        body { margin: 0; padding: 0; width: 100% !important; height: 100% !important; background-color: #f3f4f6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937; }
        
        /* Container */
        .wrapper { width: 100%; table-layout: fixed; background-color: #f3f4f6; padding: 40px 0; }
        .main-container { max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03); border: 1px solid #e5e7eb; }
        
        /* Header */
        .header { background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%); padding: 32px 30px; text-align: center; }
        .brand-title { color: #ffffff; font-size: 22px; font-weight: 700; margin: 0; letter-spacing: -0.025em; text-decoration: none; }
        .brand-subtitle { color: #bfdbfe; font-size: 13px; margin-top: 4px; margin-bottom: 0; }
        
        /* Content */
        .content { padding: 36px 32px; font-size: 15px; line-height: 1.6; color: #374151; }
        .greeting { font-size: 18px; font-weight: 600; color: #111827; margin-bottom: 16px; }
        
        /* Highlight Box */
        .info-card { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px 20px; margin: 24px 0; }
        .info-card-item { margin-bottom: 8px; font-size: 14px; }
        .info-card-item:last-child { margin-bottom: 0; }
        .info-label { font-weight: 600; color: #475569; display: inline-block; width: 130px; }
        .info-value { color: #0f172a; font-weight: 500; }
        
        /* Buttons */
        .btn-wrapper { text-align: center; margin: 30px 0; }
        .btn { display: inline-block; background-color: #2563eb; color: #ffffff !important; text-decoration: none; font-weight: 600; font-size: 15px; padding: 12px 32px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(37, 99, 235, 0.2); }
        .btn:hover { background-color: #1d4ed8; }
        
        /* Fallback Link */
        .fallback-box { border-top: 1px solid #e5e7eb; margin-top: 32px; padding-top: 20px; font-size: 12px; color: #6b7280; line-height: 1.5; }
        .fallback-url { color: #2563eb; word-break: break-all; }
        
        /* Footer */
        .footer { background-color: #f9fafb; border-top: 1px solid #e5e7eb; padding: 24px 30px; text-align: center; font-size: 12px; color: #9ca3af; }
        .footer p { margin: 4px 0; }
        .footer a { color: #6b7280; text-decoration: underline; }
        
        /* Badge */
        .badge-warning { background-color: #fef3c7; color: #92400e; border: 1px solid #fde68a; border-radius: 6px; padding: 12px 16px; font-size: 13px; margin: 20px 0; }
        
        @media only screen and (max-width: 600px) {
            .wrapper { padding: 10px !important; }
            .content { padding: 24px 18px !important; }
            .info-label { display: block; width: 100%; margin-bottom: 2px; }
        }
    </style>
</head>
<body>
    <div class="wrapper">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
            <tr>
                <td align="center">
                    <div class="main-container">
                        <!-- Header -->
                        <div class="header">
                            <h1 class="brand-title">{{ config('app.name', 'InTheKost Madiun') }}</h1>
                            <p class="brand-subtitle">Platform Informasi & Pencarian Kost Terpercaya di Madiun</p>
                        </div>
                        
                        <!-- Content -->
                        <div class="content">
                            @yield('content')
                        </div>
                        
                        <!-- Footer -->
                        <div class="footer">
                            <p>&copy; {{ date('Y') }} {{ config('app.name', 'InTheKost Madiun') }}. Hak Cipta Dilindungi.</p>
                            <p>Email ini dikirim secara otomatis oleh sistem, mohon untuk tidak membalas email ini secara langsung.</p>
                            <p>Butuh bantuan? Hubungi kami di <a href="mailto:{{ config('mail.from.address') }}">{{ config('mail.from.address') }}</a></p>
                        </div>
                    </div>
                </td>
            </tr>
        </table>
    </div>
</body>
</html>
