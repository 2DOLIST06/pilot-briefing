'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';

type AircraftModel = {
  id: string;
  name: string;
  emptyMassKg: number;
  emptyArmMm: number;
  maxTakeoffMassKg: number;
  frontSeatsArmMm: number;
  rearSeatsArmMm: number;
  baggageArmMm: number;
  fuelArmMm: number;
  fuelDensityKgPerL: number;
};

type Account = {
  fullName: string;
  email: string;
  password: string;
};

const STORAGE_KEY = 'pilot-briefing-aircraft-models';

const defaultModel: AircraftModel = {
  id: 'default-dr400',
  name: 'DR400 (exemple)',
  emptyMassKg: 650,
  emptyArmMm: 2350,
  maxTakeoffMassKg: 1000,
  frontSeatsArmMm: 2400,
  rearSeatsArmMm: 2900,
  baggageArmMm: 3400,
  fuelArmMm: 2450,
  fuelDensityKgPerL: 0.72
};

export function MassBalanceTool() {
  const [models, setModels] = useState<AircraftModel[]>([defaultModel]);
  const [activeModelId, setActiveModelId] = useState(defaultModel.id);
  const [account, setAccount] = useState<Account | null>(null);

  const [frontOccupantsKg, setFrontOccupantsKg] = useState(160);
  const [rearOccupantsKg, setRearOccupantsKg] = useState(0);
  const [baggageKg, setBaggageKg] = useState(0);
  const [fuelLiters, setFuelLiters] = useState(120);

  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as AircraftModel[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        setModels(parsed);
        setActiveModelId(parsed[0].id);
      }
    } catch {
      // ignore invalid storage content
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(models));
  }, [models]);

  const activeModel = models.find((model) => model.id === activeModelId) ?? models[0];

  const result = useMemo(() => {
    const fuelMassKg = fuelLiters * activeModel.fuelDensityKgPerL;

    const items = [
      { label: 'Masse à vide', mass: activeModel.emptyMassKg, arm: activeModel.emptyArmMm },
      { label: 'Sièges avant', mass: frontOccupantsKg, arm: activeModel.frontSeatsArmMm },
      { label: 'Sièges arrière', mass: rearOccupantsKg, arm: activeModel.rearSeatsArmMm },
      { label: 'Bagages', mass: baggageKg, arm: activeModel.baggageArmMm },
      { label: 'Carburant', mass: fuelMassKg, arm: activeModel.fuelArmMm }
    ];

    const totalMass = items.reduce((sum, item) => sum + item.mass, 0);
    const totalMoment = items.reduce((sum, item) => sum + item.mass * item.arm, 0);
    const cg = totalMass > 0 ? totalMoment / totalMass : 0;

    return {
      items,
      totalMass,
      totalMoment,
      cg,
      remainingMass: activeModel.maxTakeoffMassKg - totalMass,
      isOverweight: totalMass > activeModel.maxTakeoffMassKg
    };
  }, [activeModel, baggageKg, frontOccupantsKg, fuelLiters, rearOccupantsKg]);

  function saveModel(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const model: AircraftModel = {
      id: crypto.randomUUID(),
      name: String(formData.get('name') ?? ''),
      emptyMassKg: Number(formData.get('emptyMassKg') ?? 0),
      emptyArmMm: Number(formData.get('emptyArmMm') ?? 0),
      maxTakeoffMassKg: Number(formData.get('maxTakeoffMassKg') ?? 0),
      frontSeatsArmMm: Number(formData.get('frontSeatsArmMm') ?? 0),
      rearSeatsArmMm: Number(formData.get('rearSeatsArmMm') ?? 0),
      baggageArmMm: Number(formData.get('baggageArmMm') ?? 0),
      fuelArmMm: Number(formData.get('fuelArmMm') ?? 0),
      fuelDensityKgPerL: Number(formData.get('fuelDensityKgPerL') ?? 0.72)
    };

    setModels((prev) => [model, ...prev]);
    setActiveModelId(model.id);
    event.currentTarget.reset();
  }

  function createAccount(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const created: Account = {
      fullName: String(formData.get('fullName') ?? ''),
      email: String(formData.get('email') ?? ''),
      password: String(formData.get('password') ?? '')
    };
    setAccount(created);
    event.currentTarget.reset();
  }

  return (
    <section className="space-y-6">
      <div className="rounded-xl bg-white p-6 shadow-sm">
        <h2 className="mb-3 text-xl font-bold">Outil masse & centrage</h2>
        <p className="mb-4 text-sm text-slate-700">Renseignez les données de la fiche de pesée, puis chargez rapidement vos modèles enregistrés.</p>

        <div className="mb-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span>Modèle avion</span>
            <select className="w-full rounded border p-2" value={activeModelId} onChange={(e) => setActiveModelId(e.target.value)}>
              {models.map((model) => (
                <option key={model.id} value={model.id}>{model.name}</option>
              ))}
            </select>
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1"><span>Occupants avant (kg)</span><input type="number" className="w-full rounded border p-2" value={frontOccupantsKg} onChange={(e) => setFrontOccupantsKg(Number(e.target.value))}/></label>
          <label className="space-y-1"><span>Occupants arrière (kg)</span><input type="number" className="w-full rounded border p-2" value={rearOccupantsKg} onChange={(e) => setRearOccupantsKg(Number(e.target.value))}/></label>
          <label className="space-y-1"><span>Bagages (kg)</span><input type="number" className="w-full rounded border p-2" value={baggageKg} onChange={(e) => setBaggageKg(Number(e.target.value))}/></label>
          <label className="space-y-1"><span>Carburant (L)</span><input type="number" className="w-full rounded border p-2" value={fuelLiters} onChange={(e) => setFuelLiters(Number(e.target.value))}/></label>
        </div>

        <div className="mt-4 rounded border bg-slate-50 p-4 text-sm">
          <p><strong>Masse totale:</strong> {result.totalMass.toFixed(1)} kg</p>
          <p><strong>Centrage (bras moyen):</strong> {result.cg.toFixed(1)} mm</p>
          <p><strong>Moment total:</strong> {result.totalMoment.toFixed(0)} kg·mm</p>
          <p className={result.isOverweight ? 'font-semibold text-red-700' : 'font-semibold text-emerald-700'}>
            {result.isOverweight ? `Dépassement masse max de ${Math.abs(result.remainingMass).toFixed(1)} kg` : `Marge masse restante: ${result.remainingMass.toFixed(1)} kg`}
          </p>
        </div>
      </div>

      <form className="grid gap-4 rounded-xl bg-white p-6 shadow-sm" onSubmit={saveModel}>
        <h3 className="text-lg font-semibold">Enregistrer un modèle d'avion</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <input required name="name" placeholder="Nom du modèle" className="rounded border p-2" />
          <input required type="number" name="maxTakeoffMassKg" placeholder="Masse max (kg)" className="rounded border p-2" />
          <input required type="number" name="emptyMassKg" placeholder="Masse à vide (kg)" className="rounded border p-2" />
          <input required type="number" name="emptyArmMm" placeholder="Bras à vide (mm)" className="rounded border p-2" />
          <input required type="number" name="frontSeatsArmMm" placeholder="Bras sièges avant (mm)" className="rounded border p-2" />
          <input required type="number" name="rearSeatsArmMm" placeholder="Bras sièges arrière (mm)" className="rounded border p-2" />
          <input required type="number" name="baggageArmMm" placeholder="Bras bagages (mm)" className="rounded border p-2" />
          <input required type="number" name="fuelArmMm" placeholder="Bras carburant (mm)" className="rounded border p-2" />
          <input required type="number" step="0.01" name="fuelDensityKgPerL" defaultValue="0.72" placeholder="Densité carburant (kg/L)" className="rounded border p-2" />
        </div>
        <button type="submit" className="rounded bg-slate-900 px-4 py-2 text-white">Enregistrer le modèle</button>
      </form>

      <form className="grid gap-4 rounded-xl bg-white p-6 shadow-sm" onSubmit={createAccount}>
        <h3 className="text-lg font-semibold">Créer un compte</h3>
        <div className="grid gap-3 md:grid-cols-2">
          <input required name="fullName" placeholder="Nom complet" className="rounded border p-2" />
          <input required type="email" name="email" placeholder="Email" className="rounded border p-2" />
          <input required type="password" minLength={8} name="password" placeholder="Mot de passe (8 caractères min.)" className="rounded border p-2" />
        </div>
        <button type="submit" className="rounded bg-blue-700 px-4 py-2 text-white">Créer mon compte</button>
        {account ? <p className="text-sm text-emerald-700">Compte créé pour {account.fullName} ({account.email}).</p> : null}
      </form>
    </section>
  );
}
