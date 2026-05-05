/**
 * 派生属性重算模块
 */

import { GameState } from '../core/state.js';
import { calculatePetBonus } from './pets.js';
import { calculateTotalBonus } from './equipment.js';

function isOwned(entry) {
  return entry?.owned === true || entry?.active === true || entry?.unlocked === true;
}

function getOwnedSkills() {
  return (GameState.get('skills') || []).filter(isOwned);
}

function getOwnedResearch() {
  return (GameState.get('research') || []).filter(isOwned);
}

function getUpgradeLevel(key) {
  return GameState.get(`upgrades.${key}.level`) || 0;
}

function sumSkillEffects(type) {
  return getOwnedSkills()
    .filter(skill => skill?.type === type)
    .reduce((total, skill) => total + (skill.eff || 0), 0);
}

function sumResearchEffects(type) {
  return getOwnedResearch()
    .filter(item => item?.bonus?.type === type)
    .reduce((total, item) => total + (item.bonus?.val || 0), 0);
}

function getGlobalMultiplierBonus() {
  const skillGlobal = sumSkillEffects('global');
  const researchGlobal = sumResearchEffects('global');
  const petGlobal = calculatePetBonus('global');
  const petAll = calculatePetBonus('all');
  const stateGlobalMultiplier = Math.max(0, GameState.get('globalMultiplier') || 1);

  return skillGlobal + researchGlobal + petGlobal + petAll + (stateGlobalMultiplier - 1);
}

function getPetEffectMultiplier() {
  return Math.max(1, sumResearchEffects('pet'));
}

export function recalculateDerivedStats() {
  const equipmentBonus = calculateTotalBonus();
  const petEffectMultiplier = getPetEffectMultiplier();
  const globalMultiplierBonus = getGlobalMultiplierBonus();

  const clickBase = 1 + getUpgradeLevel('click') + (equipmentBonus.click || 0);
  const clickPercentBonus = sumSkillEffects('click')
    + sumResearchEffects('click')
    + calculatePetBonus('click') * petEffectMultiplier;

  const cpsBase = getUpgradeLevel('worker')
    + getUpgradeLevel('factory') * 10
    + getUpgradeLevel('bank') * 100
    + getUpgradeLevel('ai') * 1000
    + (equipmentBonus.cps || 0);
  const cpsPercentBonus = getUpgradeLevel('synergy') * 0.1
    + sumResearchEffects('cps')
    + calculatePetBonus('cps') * petEffectMultiplier;

  const critChance = 5
    + getUpgradeLevel('crit') * 2
    + sumSkillEffects('crit')
    + sumResearchEffects('crit')
    + (equipmentBonus.critChance || 0)
    + calculatePetBonus('crit') * petEffectMultiplier;

  const critDamage = 2
    + getUpgradeLevel('critdmg') * 0.5
    + sumSkillEffects('critdmg')
    + sumResearchEffects('critdmg')
    + (equipmentBonus.critDamage || 0);

  GameState.setMultiple({
    clickPower: clickBase * (1 + clickPercentBonus + globalMultiplierBonus),
    coinsPerSecond: cpsBase * (1 + cpsPercentBonus + globalMultiplierBonus),
    critChance,
    critDamage
  });
}
