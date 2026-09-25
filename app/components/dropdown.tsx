'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { Check } from 'lucide-react';

type Option = { value: string; label: ReactNode; icon?: ReactNode };

type DropdownProps = {
  label: string;
  children: ReactNode;
  options: Option[];
  onSelect: (value: string) => void;
  value?: string;
  heading?: ReactNode;
  className?: string;
  triggerClassName?: string;
  placement?: 'bottom' | 'top';
  align?: 'left' | 'right';
};

/** The entire trigger, including its chevron, opens the same keyboard-accessible menu. */
export function Dropdown({ label, children, options, onSelect, value, heading, className = '', triggerClassName = '', placement = 'bottom', align = 'left' }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const keyboardOpen = useRef(false);
  const id = useId();
  const selection = value !== undefined;

  useEffect(() => {
    if (!open) return;
    const dismissOutside = (event: Event) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    const dismissOther = (event: Event) => {
      if ((event as CustomEvent<string>).detail !== id) setOpen(false);
    };
    document.addEventListener('pointerdown', dismissOutside);
    document.addEventListener('focusin', dismissOutside);
    document.addEventListener('pulse:open-menu', dismissOther);
    document.dispatchEvent(new CustomEvent('pulse:open-menu', { detail: id }));
    const items = panel.current?.querySelectorAll<HTMLButtonElement>('[data-menu-item]');
    const selectedIndex = options.findIndex(option => option.value === value);
    if (keyboardOpen.current) items?.[Math.max(0, selectedIndex)]?.focus();
    return () => {
      document.removeEventListener('pointerdown', dismissOutside);
      document.removeEventListener('focusin', dismissOutside);
      document.removeEventListener('pulse:open-menu', dismissOther);
    };
    // Options may be recreated during dashboard updates; dismissal belongs to the open cycle.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, id]);

  return <div ref={root} className={`dropdown ${className}`} onKeyDown={event => {
    if (!open) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      setOpen(false);
      trigger.current?.focus();
      return;
    }
    const items = Array.from(panel.current?.querySelectorAll<HTMLButtonElement>('[data-menu-item]') ?? []);
    const index = items.indexOf(document.activeElement as HTMLButtonElement);
    if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? items.length - 1 : event.key === 'ArrowDown' ? (index + 1) % items.length : (index - 1 + items.length) % items.length;
      items[next]?.focus();
    }
  }}>
    <button ref={trigger} type="button" className={triggerClassName} aria-label={label} aria-haspopup={selection ? 'listbox' : 'menu'} aria-expanded={open} aria-controls={open ? id : undefined}
      onPointerDown={() => { keyboardOpen.current = false; }}
      onKeyDown={event => {
        if (!open && ['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
          event.preventDefault();
          keyboardOpen.current = true;
          setOpen(true);
        }
      }}
      onClick={event => { keyboardOpen.current = event.detail === 0; setOpen(current => !current); }}>
      {children}
    </button>
    {open && <div ref={panel} id={id} role={selection ? 'listbox' : 'menu'} aria-label={label} className={`dropdown-panel ${placement} ${align}`}>
      {heading && <div className="dropdown-heading" role="presentation">{heading}</div>}
      {options.map(option => <button key={option.value} type="button" data-menu-item role={selection ? 'option' : 'menuitem'} aria-selected={selection ? value === option.value : undefined}
        className={`dropdown-option ${value === option.value ? 'is-selected' : ''}`} onClick={() => {
          setOpen(false);
          trigger.current?.focus({ preventScroll: true });
          onSelect(option.value);
        }}>
        {option.icon}<span>{option.label}</span>{value === option.value && <Check size={14} />}
      </button>)}
    </div>}
  </div>;
}
