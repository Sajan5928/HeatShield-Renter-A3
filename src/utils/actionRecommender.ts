/* =============================================
   HeatShield Renter — Action Recommender
   =============================================

   Filters the master action list by relevance
   to the user's assessment answers, then returns
   the top 3–4 highest-priority recommendations.
   ============================================= */

import type { AssessmentData, Action } from '../types/assessment'
import allActions from '../data/actions'

export function getRecommendedActions(data: AssessmentData): Action[] {
  return allActions
    .filter((action) => action.relevanceCondition(data))
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 4)
}
