import "./style.css";
import type { JoinPurpose, MemberFormData } from "./types";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzbZqrT3ZM1KBijUaJje9snCf_wULbzEupQ-aH7lstw6brdliD_2_PYeg1OyFh27YmCag/exec";

const form = document.getElementById("memberForm");
const submitButton = document.getElementById("submitButton");
const message = document.getElementById("message");

if (!(form instanceof HTMLFormElement)) {
  throw new Error("HTML内に id='memberForm' の form 要素が見つかりません。");
}

if (!(submitButton instanceof HTMLButtonElement)) {
  throw new Error("HTML内に id='submitButton' の button 要素が見つかりません。");
}

if (!(message instanceof HTMLParagraphElement)) {
  throw new Error("HTML内に id='message' の p 要素が見つかりません。");
}

const getInputValue = (id: string): string => {
  const element = document.getElementById(id);

  if (
    element instanceof HTMLInputElement ||
    element instanceof HTMLTextAreaElement
  ) {
    return element.value.trim();
  }

  return "";
};

const getSelectedPurpose = (): JoinPurpose | "" => {
  const selected = document.querySelector<HTMLInputElement>(
    'input[name="purpose"]:checked'
  );

  if (!selected) {
    return "";
  }

  return selected.value as JoinPurpose;
};

const createFormData = (): MemberFormData => {
  const privacyAgreeElement = document.getElementById("privacyAgree");

  return {
    name: getInputValue("name"),
    kana: getInputValue("kana"),
    address: getInputValue("address"),
    tel: getInputValue("tel"),
    email: getInputValue("email"),
    purpose: getSelectedPurpose(),
    privacyAgree:
      privacyAgreeElement instanceof HTMLInputElement
        ? privacyAgreeElement.checked
        : false,
  };
};

const validateFormData = (data: MemberFormData): string | null => {
  if (!data.name) {
    return "氏名を入力してください。";
  }

  if (!data.kana) {
    return "フリガナを入力してください。";
  }

  if (!data.address) {
    return "住所を入力してください。";
  }

  if (!data.tel) {
    return "電話番号を入力してください。";
  }

  if (!data.email) {
    return "メールアドレスを入力してください。";
  }

  if (!data.purpose) {
    return "入会する目的を選択してください。";
  }

  if (!data.privacyAgree) {
    return "個人情報の取り扱いに同意してください。";
  }

  return null;
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const data = createFormData();
  const errorMessage = validateFormData(data);

  if (errorMessage) {
    alert(errorMessage);
    return;
  }

  console.log("送信データ:", data);

  submitButton.disabled = true;
  submitButton.textContent = "送信中...";
  message.textContent = "";

  try {
    await fetch(SCRIPT_URL, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain",
      },
      body: JSON.stringify(data),
    });

    console.log("fetch実行完了");

    message.textContent = "送信しました。ご登録ありがとうございます。";
    form.reset();
  } catch (error) {
    console.error("送信エラー:", error);
    message.textContent = "送信に失敗しました。時間をおいて再度お試しください。";
  } finally {
    submitButton.disabled = false;
    submitButton.textContent = "送信する";
  }
});