import { useFormStatus } from 'react-dom';

export default function SubmitBtn({ text, pendingText }) {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? pendingText : text}
    </button>
  );
}
