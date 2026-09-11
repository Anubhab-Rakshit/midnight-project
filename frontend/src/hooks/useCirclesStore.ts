/**
 * useCirclesStore Hook
 *
 * Persists and retrieves circles, expenses, and settlements in Supabase,
 * keyed by wallet address. Data follows the user across devices —
 * same wallet → same circles.
 *
 * Privacy: only commitment hashes are on-chain (Midnight). The actual
 * invite secret and amounts live in client-side private state only.
 */

import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// ─── Circle Record ──────────────────────────────────────────────────────────

export interface CircleRecord {
  id: string;
  walletAddress: string;
  circleName: string;
  contractAddress: string;
  inviteSecret: string;
  txHash: string | null;
  blockHeight: number | null;
  createdAt: string;
}

interface CircleRow {
  id: string;
  wallet_address: string;
  circle_name: string;
  contract_address: string;
  invite_secret: string;
  tx_hash: string | null;
  block_height: number | null;
  created_at: string;
}

// ─── Expense Record ─────────────────────────────────────────────────────────

export interface ExpenseRecord {
  id: string;
  walletAddress: string;
  circleAddress: string;
  expenseLabel: string;
  commitmentHash: string;
  txHash: string | null;
  blockHeight: number | null;
  createdAt: string;
}

interface ExpenseRow {
  id: string;
  wallet_address: string;
  circle_address: string;
  expense_label: string;
  commitment_hash: string;
  tx_hash: string | null;
  block_height: number | null;
  created_at: string;
}

// ─── Settlement Record ──────────────────────────────────────────────────────

export interface SettlementRecord {
  id: string;
  circleAddress: string;
  transferCount: number;
  txHash: string | null;
  blockHeight: number | null;
  createdAt: string;
}

interface SettlementRow {
  id: string;
  circle_address: string;
  transfer_count: number;
  tx_hash: string | null;
  block_height: number | null;
  created_at: string;
}

// ─── Mappers ────────────────────────────────────────────────────────────────

function mapCircleRow(row: CircleRow): CircleRecord {
  return {
    id: row.id,
    walletAddress: row.wallet_address,
    circleName: row.circle_name,
    contractAddress: row.contract_address,
    inviteSecret: row.invite_secret,
    txHash: row.tx_hash,
    blockHeight: row.block_height,
    createdAt: row.created_at,
  };
}

function mapExpenseRow(row: ExpenseRow): ExpenseRecord {
  return {
    id: row.id,
    walletAddress: row.wallet_address,
    circleAddress: row.circle_address,
    expenseLabel: row.expense_label,
    commitmentHash: row.commitment_hash,
    txHash: row.tx_hash,
    blockHeight: row.block_height,
    createdAt: row.created_at,
  };
}

function mapSettlementRow(row: SettlementRow): SettlementRecord {
  return {
    id: row.id,
    circleAddress: row.circle_address,
    transferCount: row.transfer_count,
    txHash: row.tx_hash,
    blockHeight: row.block_height,
    createdAt: row.created_at,
  };
}

// ─── Save Functions ─────────────────────────────────────────────────────────

export async function saveCircle(input: {
  walletAddress: string;
  circleName: string;
  contractAddress: string;
  inviteSecret: string;
  txHash?: string;
  blockHeight?: number;
}): Promise<void> {
  const { error } = await supabase.from('circles').insert({
    wallet_address: input.walletAddress,
    circle_name: input.circleName,
    contract_address: input.contractAddress,
    invite_secret: input.inviteSecret,
    tx_hash: input.txHash ?? null,
    block_height: input.blockHeight ?? null,
  });
  if (error) throw new Error(`Failed to save circle: ${error.message}`);
}

export async function saveExpense(input: {
  walletAddress: string;
  circleAddress: string;
  expenseLabel: string;
  commitmentHash: string;
  txHash?: string;
  blockHeight?: number;
}): Promise<void> {
  const { error } = await supabase.from('expenses').insert({
    wallet_address: input.walletAddress,
    circle_address: input.circleAddress,
    expense_label: input.expenseLabel,
    commitment_hash: input.commitmentHash,
    tx_hash: input.txHash ?? null,
    block_height: input.blockHeight ?? null,
  });
  if (error) throw new Error(`Failed to save expense: ${error.message}`);
}

export async function saveSettlement(input: {
  circleAddress: string;
  transferCount: number;
  txHash?: string;
  blockHeight?: number;
}): Promise<void> {
  const { error } = await supabase.from('settlements').insert({
    circle_address: input.circleAddress,
    transfer_count: input.transferCount,
    tx_hash: input.txHash ?? null,
    block_height: input.blockHeight ?? null,
  });
  if (error) throw new Error(`Failed to save settlement: ${error.message}`);
}

// ─── Fetch Functions ────────────────────────────────────────────────────────

export async function fetchCircles(walletAddress: string): Promise<CircleRecord[]> {
  const { data, error } = await supabase
    .from('circles')
    .select('*')
    .eq('wallet_address', walletAddress)
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to fetch circles: ${error.message}`);
  return (data ?? []).map(mapCircleRow);
}

export async function fetchExpenses(circleAddress: string): Promise<ExpenseRecord[]> {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .eq('circle_address', circleAddress)
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to fetch expenses: ${error.message}`);
  return (data ?? []).map(mapExpenseRow);
}

export async function fetchSettlements(circleAddress: string): Promise<SettlementRecord[]> {
  const { data, error } = await supabase
    .from('settlements')
    .select('*')
    .eq('circle_address', circleAddress)
    .order('created_at', { ascending: false });
  if (error) throw new Error(`Failed to fetch settlements: ${error.message}`);
  return (data ?? []).map(mapSettlementRow);
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useCirclesStore(walletAddress: string | null) {
  const [circles, setCircles] = useState<CircleRecord[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!walletAddress) {
      setCircles([]);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const records = await fetchCircles(walletAddress);
      setCircles(records);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch circles');
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    refetch();
  }, [refetch]);

  return {
    circles,
    isLoading,
    error,
    refetch,
  };
}
