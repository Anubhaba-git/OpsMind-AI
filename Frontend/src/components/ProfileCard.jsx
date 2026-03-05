export default function ProfileCard({ user }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5">
      <h3 className="text-lg font-semibold mb-4">Profile</h3>

      <div className="space-y-2 text-sm text-white/80">
        <p><span className="text-white/50">Name:</span> {user.name}</p>
        <p><span className="text-white/50">Email:</span> {user.email}</p>
        <p>
          <span className="text-white/50">Joined:</span>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}
