import React from 'react';
import { motion } from 'framer-motion';
import { User, Copy, Check, Crown } from 'lucide-react';
import { useToast } from './TransactionToast';

interface Member {
  id: string;
  name: string;
  address: string;
  isCreator?: boolean;
}

interface MemberListProps {
  members: Member[];
  inviteSecret: string;
}

export const MemberList: React.FC<MemberListProps> = ({ members, inviteSecret }) => {
  const [copied, setCopied] = React.useState(false);
  const { addToast } = useToast();

  const handleCopyInvite = () => {
    navigator.clipboard.writeText(inviteSecret);
    setCopied(true);
    addToast({ type: 'success', title: 'Invite Secret Copied', message: 'Share this secret phrase with your friends to let them join.' });
    setTimeout(() => setCopied(false), 2000);
  };

  const formatAddress = (addr: string) => {
    return `${addr.slice(0, 10)}...${addr.slice(-8)}`;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{
        padding: '2rem',
        background: 'rgba(212,175,55,0.05)',
        border: '1px solid rgba(212,175,55,0.2)',
        borderRadius: '16px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--accent-gold)', letterSpacing: '0.2em', margin: '0 0 0.5rem 0' }}>
            INVITE SECRET
          </h4>
          <div style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', color: '#fff', letterSpacing: '0.05em' }}>
            {inviteSecret.replace(/./g, '•').slice(0, 12)}
          </div>
        </div>
        <button
          onClick={handleCopyInvite}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.75rem 1.5rem',
            background: 'var(--accent-gold)',
            color: '#000',
            border: 'none',
            borderRadius: '999px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            letterSpacing: '0.1em'
          }}
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? 'COPIED!' : 'COPY SECRET'}
        </button>
      </div>

      <div>
        <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: 'var(--text-muted)', letterSpacing: '0.2em', marginBottom: '1rem' }}>
          VERIFIED MEMBERS ({members.length})
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {members.map((member, i) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1.25rem',
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.05)',
                borderRadius: '12px'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-gold)'
                }}>
                  <User size={18} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: '#fff' }}>
                      {member.name}
                    </span>
                    {member.isCreator && (
                      <span title="Circle Creator" style={{ color: 'var(--accent-gold)', display: 'flex' }}>
                        <Crown size={12} />
                      </span>
                    )}
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: 'var(--text-muted)' }}>
                    {formatAddress(member.address)}
                  </div>
                </div>
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9px', color: '#34d399', letterSpacing: '0.1em', background: 'rgba(52,211,153,0.1)', padding: '0.25rem 0.5rem', borderRadius: '4px' }}>
                ZK VERIFIED
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
