import { useState } from "react";

type HeaderProps = {
  user: { name: string; email: string; avatar: string };
  onSignOut: () => void;
};

export function Header({ user, onSignOut }: HeaderProps) {
  const [avatarFailed, setAvatarFailed] = useState(false);
  return (
    <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-indigo-600">StudyOS</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">Keep your study plan moving.</h1>
        <p className="mt-2 max-w-xl text-slate-600">Organize your subjects and focus on the next task.</p>
      </div>
      <div className="flex items-center gap-3">
        {user.avatar && !avatarFailed ? <img alt="" className="size-9 rounded-full object-cover" onError={() => setAvatarFailed(true)} src={user.avatar} /> : <span className="grid size-9 place-items-center rounded-full bg-indigo-100 font-semibold text-indigo-700">{user.name[0]}</span>}
        <div className="text-right"><p className="text-sm font-semibold text-slate-800">{user.name}</p><p className="text-xs text-slate-500">{user.email}</p></div>
        <button className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50" onClick={onSignOut} type="button">Sign out</button>
      </div>
    </header>
  );
}
