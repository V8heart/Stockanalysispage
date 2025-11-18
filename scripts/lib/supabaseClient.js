"use client"; // 브라우저 전용 지정
import { createBrowserClient } from '@supabase/ssr';
export const createClient = () => createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_KEY);
