'use client';

import { Bold, Italic, Heading2, List, ListOrdered, Code, Minus, Zap } from 'lucide-react';

function ToolbarBtn({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <button
      title={label}
      className="w-7 h-7 flex items-center justify-center rounded text-(--text-muted) hover:text-(--text-primary) hover:bg-(--bg-overlay) transition-colors"
    >
      <Icon size={14} />
    </button>
  );
}

interface Props {
  showAiButton: boolean;
  onRegenerate?: () => void;
}

export default function EditorToolbar({ showAiButton, onRegenerate }: Props) {
  return (
    <div className="flex items-center gap-0.5 px-10 py-2 border-y border-(--border) bg-(--bg-raised)">
      <ToolbarBtn icon={Bold} label="Bold" />
      <ToolbarBtn icon={Italic} label="Italic" />
      <ToolbarBtn icon={Heading2} label="Heading" />
      <div className="w-px h-4 bg-(--border) mx-1" />
      <ToolbarBtn icon={List} label="Bullet list" />
      <ToolbarBtn icon={ListOrdered} label="Numbered list" />
      <div className="w-px h-4 bg-(--border) mx-1" />
      <ToolbarBtn icon={Code} label="Code block" />
      <ToolbarBtn icon={Minus} label="Divider" />

      {showAiButton && onRegenerate && (
        <>
          <div className="w-px h-4 bg-(--border) mx-1" />
          <button
            onClick={onRegenerate}
            className="flex items-center gap-1.5 px-2.5 py-1 ml-1 bg-blue-500/10 border border-blue-500/20 hover:bg-blue-500/15 text-blue-400 text-xs font-medium rounded-md transition-colors"
          >
            <Zap size={11} />
            Regenerate with AI
          </button>
        </>
      )}
    </div>
  );
}