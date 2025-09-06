import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { ReactNode } from 'react';

interface ConfirmDialogProps {
  children: ReactNode;
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  variant?: 'default' | 'destructive';
  confirmText?: string;
  cancelText?: string;
}

export function ConfirmDialog({
  children,
  title,
  description,
  onConfirm,
  variant = 'default',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}: ConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={variant === 'destructive' 
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
              : undefined
            }
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

interface BulkConfirmDialogProps {
  children: ReactNode;
  title: string;
  description: string;
  onConfirm: () => void | Promise<void>;
  selectedCount: number;
  variant?: 'default' | 'destructive';
  confirmText?: string;
  cancelText?: string;
}

export function BulkConfirmDialog({
  children,
  title,
  description,
  onConfirm,
  selectedCount,
  variant = 'default',
  confirmText = 'Confirm',
  cancelText = 'Cancel'
}: BulkConfirmDialogProps) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>
            {description.replace('{count}', selectedCount.toString())}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancelText}</AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            className={variant === 'destructive' 
              ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90' 
              : undefined
            }
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}