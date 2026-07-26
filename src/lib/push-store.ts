const subscriptions = new Map<string, PushSubscriptionJSON>();

export function addSubscription(sub: PushSubscriptionJSON): void {
  const key = JSON.stringify(sub);
  subscriptions.set(key, sub);
}

export function removeSubscription(sub: PushSubscriptionJSON): void {
  const key = JSON.stringify(sub);
  subscriptions.delete(key);
}

export function clearSubscriptions(): void {
  subscriptions.clear();
}

export function getAllSubscriptions(): PushSubscriptionJSON[] {
  return Array.from(subscriptions.values());
}
