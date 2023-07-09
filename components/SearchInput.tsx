"use client";
import React, { useEffect, useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';
import { useRouter } from 'next/navigation';
import qs from 'query-string';

export const SearchInput = () => {
  const router = useRouter();
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce<string>(value, 500);

  useEffect(() => {
    const query = {
      title: debouncedValue,
    }

    const url = qs.stringifyUrl({
      url: '/search',
      query: query
    });

    router.push(url);
  }, [debouncedValue, router])

  return (
    <input type="text" onChange={(e) => setValue(e.target.value)} />
  )
}