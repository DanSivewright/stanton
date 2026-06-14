# Bidirectional asset movement sync

Asset placement changes always produce an audit record, and movement records always update the asset's current location. Either entry point — editing `assets.location` in admin or creating an `asset-movements` document — keeps both in sync.

Hooks on `assets.afterChange` and `asset-movements.afterChange` perform the cross-update. A `req.context` guard (`skipAssetSync` / `skipMovementSync`) prevents infinite hook loops when one collection triggers an update on the other.
