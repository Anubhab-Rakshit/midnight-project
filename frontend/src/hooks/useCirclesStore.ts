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

// ─── Recurring Pact Record ─────────────────────────────────────────────────

export interface RecurringPactRecord {
  id: string;
  walletAddress: string;
  circleAddress: string;
  pactName: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek: number | null;
  dayOfMonth: number | null;
  isActive: boolean;
  lastSettledAt: string | null;
  nextSettlementAt: string | null;
  createdAt: string;
}

interface RecurringPactRow {
  id: string;
  wallet_address: string;
  circle_address: string;
  pact_name: string;
  frequency: string;
  day_of_week: number | null;
  day_of_month: number | null;
  is_active: boolean;
  last_settled_at: string | null;
  next_settlement_at: string | null;
  created_at: string;
}

// ─── Pact Member Record ────────────────────────────────────────────────────

export interface PactMemberRecord {
  id: string;
  pactId: string;
  walletAddress: string;
  memberName: string;
  joinedAt: string;
}

interface PactMemberRow {
  id: string;
  pact_id: string;
  wallet_address: string;
  member_name: string;
  joined_at: string;
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

function mapRecurringPactRow(row: RecurringPactRow): RecurringPactRecord {
  return {
    id: row.id,
    walletAddress: row.wallet_address,
    circleAddress: row.circle_address,
    pactName: row.pact_name,
    frequency: row.frequency as RecurringPactRecord['frequency'],
    dayOfWeek: row.day_of_week,
    dayOfMonth: row.day_of_month,
    isActive: row.is_active,
    lastSettledAt: row.last_settled_at,
    nextSettlementAt: row.next_settlement_at,
    createdAt: row.created_at,
  };
}

function mapPactMemberRow(row: PactMemberRow): PactMemberRecord {
  return {
    id: row.id,
    pactId: row.pact_id,
    walletAddress: row.wallet_address,
    memberName: row.member_name,
    joinedAt: row.joined_at,
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

// ─── Recurring Pact Functions ──────────────────────────────────────────────

export async function saveRecurringPact(input: {
  walletAddress: string;
  circleAddress: string;
  pactName: string;
  frequency: 'weekly' | 'biweekly' | 'monthly';
  dayOfWeek?: number;
  dayOfMonth?: number;
}): Promise<string> {
  // Calculate next settlement date
  const now = new Date();
  let nextSettlement = new Date(now);

  if (input.frequency === 'weekly' && input.dayOfWeek !== undefined) {
    const daysUntil = (input.dayOfWeek - now.getDay() + 7) % 7 || 7;
    nextSettlement.setDate(now.getDate() + daysUntil);
  } else if (input.frequency === 'biweekly' && input.dayOfWeek !== undefined) {
    const daysUntil = (input.dayOfWeek - now.getDay() + 14) % 14 || 14;
    nextSettlement.setDate(now.getDate() + daysUntil);
  } else if (input.frequency === 'monthly' && input.dayOfMonth !== undefined) {
    nextSettlement.setDate(input.dayOfMonth);
    if (nextSettlement <= now) {
      nextSettlement.setMonth(nextSettlement.getMonth() + 1);
    }
  } else {
    // Default: next Monday
    const daysUntilMonday = (1 - now.getDay() + 7) % 7 || 7;
    nextSettlement.setDate(now.getDate() + daysUntilMonday);
  }

  const { data, error } = await supabase
    .from('recurring_pacts')
    .insert({
      wallet_address: input.walletAddress,
      circle_address: input.circleAddress,
      pact_name: input.pactName,
      frequency: input.frequency,
      day_of_week: input.dayOfWeek ?? null,
      day_of_month: input.dayOfMonth ?? null,
      next_settlement_at: nextSettlement.toISOString(),
    })
    .select('id')
    .single();

  if (error) throw new Error(`Failed to save recurring pact: ${error.message}`);
  return data.id;
}

export async function savePactMember(input: {
  pactId: string;
  walletAddress: string;
  memberName: string;
}): Promise<void> {
  const { error } = await supabase.from('pact_members').insert({
    pact_id: input.pactId,
    wallet_address: input.walletAddress,
    member_name: input.memberName,
  });
  if (error) throw new Error(`Failed to save pact member: ${error.message}`);
}

export async function fetchRecurringPacts(walletAddress: string): Promise<RecurringPactRecord[]> {
  const { data, error } = await supabase
    .from('recurring_pacts')
    .select('*')
    .eq('wallet_address', walletAddress)
    .eq('is_active', true)
    .order('next_settlement_at', { ascending: true });
  if (error) throw new Error(`Failed to fetch recurring pacts: ${error.message}`);
  return (data ?? []).map(mapRecurringPactRow);
}

export async function fetchPactMembers(pactId: string): Promise<PactMemberRecord[]> {
  const { data, error } = await supabase
    .from('pact_members')
    .select('*')
    .eq('pact_id', pactId)
    .order('joined_at', { ascending: true });
  if (error) throw new Error(`Failed to fetch pact members: ${error.message}`);
  return (data ?? []).map(mapPactMemberRow);
}

export async function updatePactSettlement(pactId: string): Promise<void> {
  const now = new Date();
  const { error } = await supabase
    .from('recurring_pacts')
    .update({
      last_settled_at: now.toISOString(),
    })
    .eq('id', pactId);
  if (error) throw new Error(`Failed to update pact settlement: ${error.message}`);
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
