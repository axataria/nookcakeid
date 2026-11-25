import { NextResponse } from 'next/server';
export async function POST(){return NextResponse.json({error:'Pembayaran online belum tersedia. Hubungi baker melalui Instagram untuk konfirmasi pesanan.'},{status:503});}
