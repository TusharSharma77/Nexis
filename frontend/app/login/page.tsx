'use client';

// Login page — phone / SMS OTP sign-in
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useUserStore } from '@/stores/user';
import { LOCAL_GUEST_ACCESS, MOCK_MODE, loginWithSms, sendSmsCode } from '@/lib/client';

const USE_MOCK = MOCK_MODE;

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useUserStore((s) => s.setAuth);

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [counter, setCounter] = useState(0);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (LOCAL_GUEST_ACCESS) router.replace('/');
  }, [router]);

  if (LOCAL_GUEST_ACCESS) {
    return null;
  }

  function startCounter() {
    setCounter(60);
    const t = setInterval(() => {
      setCounter((c) => {
        if (c <= 1) {
          clearInterval(t);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  async function sendCode() {
    setErr(null);
    if (!/^\d{10,11}$/.test(phone)) {
      setErr('Please enter a valid phone number');
      return;
    }
    setLoading(true);
    try {
      if (!USE_MOCK) {
        await sendSmsCode(phone);
      }
      setStep('code');
      startCounter();
    } catch (e) {
      setErr(`Failed to send code: ${e instanceof Error ? e.message : 'unknown'}`);
    } finally {
      setLoading(false);
    }
  }

  async function login() {
    setErr(null);
    if (!/^\d{6}$/.test(code)) {
      setErr('Please enter the 6-digit verification code');
      return;
    }
    setLoading(true);
    try {
      if (USE_MOCK) {
        setAuth({ id: 'mock-user', phone, nickname: `User_${phone.slice(-4)}` }, 'mock-token');
      } else {
        const data = await loginWithSms(phone, code);
        setAuth(
          { id: data.user_id, phone, nickname: `User_${phone.slice(-4)}` },
          data.access_token,
        );
      }
      router.push('/');
    } catch (e) {
      setErr(`Login failed: ${e instanceof Error ? e.message : 'unknown'}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen place-items-center bg-wechat-bg">
      <div className="w-[360px] rounded-md border border-wechat-line bg-white p-6 shadow-sm">
        <h1 className="mb-1 text-center text-[17px] font-semibold text-wechat-fg">
          Sign In to Nexis
        </h1>
        <p className="mb-4 text-center text-[12px] text-wechat-mute">
          Your Dedicated Multi-Agent AI Team
        </p>

        {step === 'phone' ? (
          <>
            <label htmlFor="phone" className="mb-1 block text-[12px] text-wechat-sub">Phone Number</label>
            <input
              id="phone"
              autoFocus
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
              placeholder="Enter phone number (dev: 13800000000)"
              maxLength={11}
              className="mb-3 w-full rounded-sm border border-wechat-line bg-white px-2 py-1.5 text-[13px] outline-none focus:border-wechat-green"
            />
            <button
              type="button"
              onClick={sendCode}
              disabled={loading}
              className="w-full rounded-sm bg-wechat-green py-2 text-[13px] text-white hover:bg-[#06AE56] disabled:opacity-50"
            >
              {loading ? 'Sending…' : 'Get Verification Code'}
            </button>
          </>
        ) : (
          <>
            <label htmlFor="code" className="mb-1 block text-[12px] text-wechat-sub">
              Code sent to {phone} (Dev OTP: 123456)
            </label>
            <input
              id="code"
              autoFocus
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              placeholder="6-digit code (123456)"
              maxLength={6}
              className="mb-3 w-full rounded-sm border border-wechat-line bg-white px-2 py-1.5 text-[13px] outline-none focus:border-wechat-green"
            />
            <div className="mb-3 flex items-center justify-between text-[11px]">
              <button
                type="button"
                onClick={() => setStep('phone')}
                className="text-wechat-sub hover:text-wechat-fg"
              >
                ← Change Number
              </button>
              <button
                type="button"
                disabled={counter > 0 || loading}
                onClick={sendCode}
                className="text-wechat-green disabled:text-wechat-mute"
              >
                {counter > 0 ? `Resend in ${counter}s` : 'Resend Code'}
              </button>
            </div>
            <button
              type="button"
              onClick={login}
              disabled={loading}
              className="w-full rounded-sm bg-wechat-green py-2 text-[13px] text-white hover:bg-[#06AE56] disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </>
        )}

        {err && (
          <div className="mt-3 rounded-sm bg-red-50 px-2 py-1.5 text-center text-[11px] text-red-600">
            {err}
          </div>
        )}

        <p className="mt-5 text-center text-[10px] text-wechat-mute">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </main>
  );
}
