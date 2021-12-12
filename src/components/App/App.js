import { useState, useRef, useEffect } from "react";
import NumberFormat from "react-number-format";
import "./app.css";

function App() {
  const amountRef = useRef(null);
  const [form, setForm] = useState({
    amount: "",
    accountAmount: "",
    iva: false,
  });
  const [j, setJ] = useState(0);
  const [k, setK] = useState(0);
  const [iva, setIva] = useState(0);
  const [toTransferToLawyer, setToTransferToLawyer] = useState(0);
  const [toTransferToCaja, setToTransferToCaja] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [controlAmount, setControlAmount] = useState(0);

  const toCurrency = (number) =>
    new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
    }).format(number);

  useEffect(() => {
    if (form.amount) {
      const amount = parseFloat(form.amount);
      const accountAmount = parseFloat(form.accountAmount) || 0;
      setJ(amount * 0.08);
      setK(amount * 0.1);
      setIva(form.iva ? amount * 0.21 : 0);
      setToTransferToLawyer(amount * 0.92 + iva);
      setToTransferToCaja(j + k);
      setTotalAmount(toTransferToCaja + toTransferToLawyer);
      if (accountAmount) {
        setControlAmount(accountAmount - totalAmount);
      } else {
        setControlAmount(0);
      }
      return;
    }
    setJ(0);
    setK(0);
    setIva(0);
    setToTransferToLawyer(0);
    setToTransferToCaja(0);
    setTotalAmount(0);
    setControlAmount(0);
  }, [
    controlAmount,
    form.amount,
    form.iva,
    form.accountAmount,
    iva,
    toTransferToCaja,
    toTransferToLawyer,
    totalAmount,
    j,
    k,
  ]);

  const clearForm = () => {
    setForm({
      amount: "",
      accountAmount: "",
      iva: false,
    });
    amountRef.current.focus();
  };
  return (
    <div className="selection:bg-sky-700 selection:text-white text-gray-800">
      <h1 className="text-center text-6xl my-6">Transferencia de honorarios</h1>
      <div className="container max-w-3xl mx-auto bg-sky-100 text-xl p-10 rounded shadow-2xl shadow-sky-600/30">
        <div class="grid grid-cols-1 gap-4">
          <div className="font-bold flex justify-end items-center">
            Monto de honorarios{" "}
          </div>
          <NumberFormat
            className="bg-sky-200 text-gray-800 text-xl font-bold border-2 border-sky-600 rounded py-2 px-4"
            value={form.amount}
            name="amount"
            thousandSeparator="."
            decimalSeparator=","
            decimalScale="2"
            prefix="$ "
            onValueChange={(e) => setForm({ ...form, amount: e.floatValue })}
          />
          <div className="text-right py-1 flex justify-end items-center">
            Ley 6059 (8% Abogado){" "}
          </div>
          <div className="px-4 py-1">{form.amount && toCurrency(j)}</div>
          <div className="text-right py-1 flex justify-end items-center">
            Ley 6059 (10% Condenado en costas){" "}
          </div>
          <div className="px-4 py-1">{form.amount && toCurrency(k)}</div>

          <div className="text-right">
            <div>
              <label class="inline-flex items-center">
                <span class="mr-2">IVA</span>
                <input
                  type="checkbox"
                  checked={form.iva}
                  onChange={(e) => setForm({ ...form, iva: e.target.checked })}
                  class="form-checkbox text-sky-500 bg-sky-400 rounded border-none outline-none"
                />
              </label>
            </div>
          </div>
          <div className="px-4 py-1">
            {form.amount && form.iva && toCurrency(iva)}
          </div>
          <div className="text-right py-1 font-bold flex justify-end items-center">
            Monto a transferir a abogado{" "}
          </div>
          <div className="px-4 py-1">
            {form.amount && toCurrency(toTransferToLawyer)}
          </div>
          <div className="text-right py-1 font-bold flex justify-end items-center">
            Monto a transferir a Caja de prev.{" "}
          </div>
          <div className="px-4 py-1">
            {form.amount && toCurrency(toTransferToCaja)}
          </div>
          <div className="text-right py-1 font-bold flex justify-end items-center">
            Monto total transferido{" "}
          </div>
          <div className="px-4 py-1">
            {form.amount && toCurrency(totalAmount)}
          </div>
          <div className="text-center col-span-2 mt-4 text-2xl font-bold">
            CONTROL
          </div>

          <div className="font-bold flex justify-end items-center">
            Monto en cuenta{" "}
          </div>
          <NumberFormat
            className="bg-sky-200 text-gray-800 text-xl font-bold border-2 border-sky-600 rounded py-2 px-4"
            value={form.accountAmount}
            name="accountAmount"
            thousandSeparator="."
            decimalSeparator=","
            decimalScale="2"
            prefix="$ "
            onValueChange={(e) =>
              setForm({ ...form, accountAmount: e.floatValue })
            }
          />
          <div className="text-right py-1 flex justify-end items-center">
            Monto luego de transferir{" "}
          </div>
          <div
            className={`px-4 py-1 rounded ${
              controlAmount >= 0 ? "" : "bg-red-200 text-red-800 font-bold"
            }`}
          >
            {form.amount && form.accountAmount && toCurrency(controlAmount)}
          </div>
          <div className="col-span-2 flex justify-center">
            <button
              onClick={clearForm}
              className=" bg-sky-500 rounded py-3 px-6 mt-6 text-sky-900 font-bold inline-block"
            >
              Limpiar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
