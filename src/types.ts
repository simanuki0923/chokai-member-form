export type JoinPurpose =
  | "会員になりたい"
  | "役員をやりたい"
  | "イベントのみ参加したい";

export type MemberFormData = {
  name: string;
  kana: string;
  address: string;
  tel: string;
  email: string;
  purpose: JoinPurpose | "";
  privacyAgree: boolean;
};