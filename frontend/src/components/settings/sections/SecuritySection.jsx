import Card from "../../../components/settings/Card";

const SecuritySection = () => (
  <div className="max-w-3xl space-y-6">
    <Card title="Security" subtitle="Manage your account security">
      <div className="flex items-center justify-between py-4 border-b border-neutral-800">
        <div>
          <p className="font-medium">Two-Factor Authentication</p>

          <p className="text-sm text-gray-400">
            Add an extra layer of security
          </p>
        </div>

        <button className="border border-neutral-800 text-sm px-4 py-1.5 rounded-lg hover:bg-neutral-800 transition">
          Enable
        </button>
      </div>

      <div className="flex items-center justify-between pt-4">
        <div>
          <p className="font-medium">Change Password</p>

          <p className="text-sm text-gray-400">
            Update your password regularly
          </p>
        </div>

        <button className="border border-neutral-800 text-sm px-4 py-1.5 rounded-lg hover:bg-neutral-800 transition">
          Update
        </button>
      </div>
    </Card>

    <Card
      title="🚨 Danger Zone"
      subtitle="Irreversible account actions"
      danger
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-red-500">Delete Account</p>

          <p className="text-sm text-gray-400">
            Permanently delete your account and all data
          </p>
        </div>

        <button className="bg-red-500 hover:bg-red-600 text-sm px-4 py-1.5 rounded-lg font-medium transition">
          Delete Account
        </button>
      </div>
    </Card>
  </div>
);


export default SecuritySection