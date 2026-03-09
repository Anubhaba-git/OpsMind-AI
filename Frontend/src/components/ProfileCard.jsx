export default function ProfileCard({ user }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:shadow-lg transition">
      
      <h3 className="text-lg font-semibold mb-4">Profile</h3>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-lg font-semibold">
          {user.name?.charAt(0)}
        </div>

        <div>
          <p className="font-semibold">{user.name}</p>
          <p className="text-xs text-white/60">{user.email}</p>
        </div>
      </div>

      {/* Details */}
      <div className="space-y-2 text-sm text-white/80 border-t border-white/10 pt-3">
        <p>
          <span className="text-white/50">Joined:</span>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>

    </div>
  );
}