export function isOwnerOrAdmin(user, ownerId) {
  return (
    user.role === "admin" || user._id.toString() === ownerId.toString()
  );
}