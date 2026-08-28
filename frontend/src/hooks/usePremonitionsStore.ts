/**
 * usePremonitionsStore Hook
 *
 * Persists and retrieves premonitions in Supabase, keyed by wallet address.
 * Data follows the user across devices — same wallet → same chronicles.
 *
 * Privacy: only the commitment hash is on-chain (Midnight). The premonition
 * text itself lives in this private postgres table.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface PremonitionRecord {
  id: string;
  walletAddress: string;
  premonitionText: string;
  commitmentHash: string;
  txHash: string | null;
  blockHeight: number | null;
  createdAt: string;
}

interface Row {
  id: string;
  wallet_address: string;
  premonition_text: string;
  commitment_hash: string;
  tx_hash: string | null;
  block_height: number | null;
  created_at: string;
}

export async function savePremonition(input: {
  walletAddress: string;
  premonitionText: string;
  commitmentHash: string;
  txHash?: string;
  blockHeight?: number;
}): Promise<void> {
  const { error } = await supabase.from('premonitions').insert({
    wallet_address: input.walletAddress,
    premonition_text: input.premonitionText,
    commitment_hash: input.commitmentHash,
    tx_hash: input.txHash ?? null,
    block_height: input.blockHeight ?? null,
  });

  if (error) {
    throw new Error(`Failed to save premonition: ${error.message}`);
  }
}

export async function fetchPremonitions(walletAddress: string): Promise<PremonitionRecord[]> {
  const { data, error } = await supabase
    .from('premonitions')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch premonitions: ${error.message}`);
  }

  return (data ?? []).map(mapRow);
}

function mapRow(row: Row): PremonitionRecord {
  return {
    id: row.id,
    walletAddress: row.wallet_address,
    premonitionText: row.premonition_text,
    commitmentHash: row.commitment_hash,
    txHash: row.tx_hash,
    blockHeight: row.block_height,
    createdAt: row.created_at,
  };
}

export function usePremonitionsStore(walletAddress: string | null) {
  const [premonitions, setPremonitions] = useState<PremonitionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!walletAddress) {
      setPremonitions([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const records = await fetchPremonitions(walletAddress);
      setPremonitions(records);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch premonitions');
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    premonitions,
    isLoading,
    error,
    refetch,
  };
}
