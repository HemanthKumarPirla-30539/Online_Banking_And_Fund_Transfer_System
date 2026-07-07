import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import beneficiaryService from '../services/beneficiaryService';
import LoadingSpinner from '../components/LoadingSpinner';

function BeneficiariesPage() {
  const { accountId } = useAuth();
  const [beneficiaries, setBeneficiaries] = useState([]);
  const [editingBeneficiary, setEditingBeneficiary] = useState(null);
  const [form, setForm] = useState({
    beneficiaryName: '',
    beneficiaryAccountNumber: '',
    bankName: '',
    ifsc: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadBeneficiaries = async () => {
    if (!accountId) {
      setLoading(false);
      return;
    }

    try {
      const data = await beneficiaryService.getAll(accountId);
      setBeneficiaries(data || []);
    } catch (error) {
      toast.error(error?.message || 'Unable to load beneficiaries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBeneficiaries();
  }, [accountId]);

  const resetForm = () => {
    setEditingBeneficiary(null);
    setForm({ beneficiaryName: '', beneficiaryAccountNumber: '', bankName: '', ifsc: '' });
  };

  const beginCreate = () => {
    resetForm();
  };

  const beginEdit = (beneficiary) => {
    setEditingBeneficiary(beneficiary);
    setForm({
      beneficiaryName: beneficiary.beneficiaryName || '',
      beneficiaryAccountNumber: beneficiary.beneficiaryAccountNumber || '',
      bankName: beneficiary.bankName || '',
      ifsc: beneficiary.ifsc || '',
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);

    try {
      const payload = { accountId, ...form };
      if (editingBeneficiary) {
        await beneficiaryService.update(editingBeneficiary.id, payload);
        toast.success('Beneficiary updated');
      } else {
        await beneficiaryService.add(payload);
        toast.success('Beneficiary added');
      }
      await loadBeneficiaries();
      resetForm();
    } catch (error) {
      toast.error(error?.message || 'Failed to save beneficiary');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await beneficiaryService.remove(id);
      setBeneficiaries((prev) => prev.filter((beneficiary) => beneficiary.id !== id));
      toast.success('Beneficiary deleted');
    } catch (error) {
      toast.error(error?.message || 'Failed to delete beneficiary');
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Beneficiaries</h2>
        <button className="btn btn-primary" onClick={beginCreate}>
          Add Beneficiary
        </button>
      </div>

      <div className="card p-4 shadow-sm mb-4">
        <h5 className="mb-3">{editingBeneficiary ? 'Edit Beneficiary' : 'Add Beneficiary'}</h5>
        <form onSubmit={handleSubmit} className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Beneficiary Name</label>
            <input className="form-control" name="beneficiaryName" value={form.beneficiaryName} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Beneficiary Account Number</label>
            <input className="form-control" name="beneficiaryAccountNumber" value={form.beneficiaryAccountNumber} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">Bank Name</label>
            <input className="form-control" name="bankName" value={form.bankName} onChange={handleChange} required />
          </div>
          <div className="col-md-6">
            <label className="form-label">IFSC</label>
            <input className="form-control" name="ifsc" value={form.ifsc} onChange={handleChange} required />
          </div>
          <div className="col-12 d-flex gap-2">
            <button className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : editingBeneficiary ? 'Update Beneficiary' : 'Save Beneficiary'}
            </button>
            {editingBeneficiary && (
              <button type="button" className="btn btn-outline-secondary" onClick={resetForm}>
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
      <div className="card p-4 shadow-sm">
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th>Name</th>
                <th>Account</th>
                <th>Bank</th>
                <th>IFSC</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {beneficiaries.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center py-4">
                    No beneficiaries available.
                  </td>
                </tr>
              ) : (
                beneficiaries.map((beneficiary) => (
                  <tr key={beneficiary.id}>
                    <td>{beneficiary.beneficiaryName}</td>
                    <td>{beneficiary.beneficiaryAccountNumber}</td>
                    <td>{beneficiary.bankName || 'N/A'}</td>
                    <td>{beneficiary.ifsc || 'N/A'}</td>
                    <td>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => beginEdit(beneficiary)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(beneficiary.id)}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default BeneficiariesPage;
